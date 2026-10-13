# syntax=docker/dockerfile:1
#
# Build context MUST be the repository root:
# docker build -f apps/server/Dockerfile --target release -t ofo-server .
#
# Stages: base -> prune -> install -> build -> prod-deps; ytdlp-bin; release (default, last stage)

ARG NODE_VERSION=24
ARG PNPM_VERSION=12.7.0
ARG TURBO_VERSION=2.10.5
ARG YTDLP_VERSION=2026.08.19

# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS base
ARG PNPM_VERSION
ENV CI=true \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    COREPACK_HOME=/usr/local/share/corepack \
    TURBO_TELEMETRY_DISABLED=1
RUN corepack enable \
 && corepack prepare "pnpm@${PNPM_VERSION}" --activate \
 && chmod -R a+rwX "${COREPACK_HOME}"
WORKDIR /app

# ---------------------------------------------------------------------------
FROM base AS prune
ARG TURBO_VERSION
RUN npm install --global "turbo@${TURBO_VERSION}"
COPY . .
# out/json: package.json files only (cache-friendly), out/full: sources, out/pnpm-lock.yaml: pruned lockfile
# cleanupUnusedCatalogs is dropped from the pruned workspace file: the pruned lockfile keeps the whole
# catalog while pnpm would only keep entries used by the remaining projects, which fails
# "--frozen-lockfile" with ERR_PNPM_LOCKFILE_CONFIG_MISMATCH.
RUN turbo prune @ofo/server --docker \
 && sed -i '/^cleanupUnusedCatalogs:/d' out/pnpm-workspace.yaml

# ---------------------------------------------------------------------------
FROM base AS install
COPY --from=prune /app/out/json/ ./
COPY --from=prune /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=prune /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN --mount=type=cache,id=ofo-pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir /pnpm/store

# ---------------------------------------------------------------------------
FROM install AS build
COPY --from=prune /app/out/full/ ./
RUN pnpm --filter @ofo/server build

# ---------------------------------------------------------------------------
FROM base AS prod-deps
COPY --from=prune /app/out/json/ ./
COPY --from=prune /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=prune /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN --mount=type=cache,id=ofo-pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod --store-dir /pnpm/store

# ---------------------------------------------------------------------------
FROM debian:bookworm-slim AS ytdlp-bin
ARG TARGETARCH
ARG YTDLP_VERSION
# Checksums of the default version (from its SHA2-256SUMS); when overriding the version, pass the
# new ones or leave them empty to verify against the checksum file published with the release.
ARG YTDLP_SHA256_AMD64=58162f9bfdc27458ea47bfcb311cf47028f17d8154a8bf7d689861d46399230a
ARG YTDLP_SHA256_ARM64=b16e4dab368a816cd05d477d698a605a6ae87ccee1c8ffd38fa21d7254141fcc
RUN apt-get update \
 && apt-get install --yes --no-install-recommends ca-certificates curl \
 && rm -rf /var/lib/apt/lists/*
RUN set -eu; \
    case "${TARGETARCH:-amd64}" in \
      amd64) asset=yt-dlp_linux; sha="${YTDLP_SHA256_AMD64}" ;; \
      arm64) asset=yt-dlp_linux_aarch64; sha="${YTDLP_SHA256_ARM64}" ;; \
      *) echo "unsupported architecture: ${TARGETARCH}" >&2; exit 1 ;; \
    esac; \
    base="https://github.com/yt-dlp/yt-dlp/releases/download/${YTDLP_VERSION}"; \
    curl --fail --silent --show-error --location --retry 3 --output /yt-dlp "${base}/${asset}"; \
    if [ -z "${sha}" ]; then \
      sha="$(curl --fail --silent --show-error --location --retry 3 "${base}/SHA2-256SUMS" \
        | awk -v f="${asset}" '$2 == f { print $1 }')"; \
    fi; \
    echo "${sha}  /yt-dlp" | sha256sum --check --strict -; \
    chmod 0755 /yt-dlp

# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS release
# ffmpeg (conversion, tags) and ffprobe (verification) come from the same apt package
RUN apt-get update \
 && apt-get install --yes --no-install-recommends ffmpeg ca-certificates \
 && rm -rf /var/lib/apt/lists/*
COPY --from=ytdlp-bin /yt-dlp /usr/local/bin/yt-dlp

ENV NODE_ENV=production \
    PORT=8080 \
    AUDIO_TMP_DIR=/var/cache/ofo/audio-tmp \
    YTDLP_PATH=/usr/local/bin/yt-dlp \
    YTDLP_JS_RUNTIME=node \
    FFMPEG_PATH=/usr/bin/ffmpeg \
    FFPROBE_PATH=/usr/bin/ffprobe

# Created before the volume is mounted so that the named volume inherits the ownership.
RUN mkdir -p /var/cache/ofo/audio-tmp /app/apps/server \
 && chown -R node:node /var/cache/ofo /app

USER node
WORKDIR /app/apps/server

COPY --from=prod-deps --chown=node:node /app/node_modules /app/node_modules
COPY --from=prod-deps --chown=node:node /app/apps/server/node_modules ./node_modules
COPY --from=build --chown=node:node /app/apps/server/package.json ./package.json
COPY --from=build --chown=node:node /app/apps/server/dist ./dist
# @ofo/ytdlp is a workspace package consumed as TypeScript source (Node strips the types at runtime);
# its symlink in node_modules points at /app/packages/ytdlp. @ofo/server-contract is types only.
COPY --from=build --chown=node:node /app/packages/ytdlp/package.json /app/packages/ytdlp/package.json
COPY --from=build --chown=node:node /app/packages/ytdlp/src /app/packages/ytdlp/src

EXPOSE 8080
CMD ["node", "dist/src/main.js"]
