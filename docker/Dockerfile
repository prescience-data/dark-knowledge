ARG BASE=docker.io/pdf2htmlex/pdf2htmlex:0.18.8.rc2-master-20200820-ubuntu-20.04-x86_64

# Build
FROM ${BASE}
ENV DEBIAN_FRONTEND noninteractive

# Use bash, not sh
SHELL ["/bin/bash", "-c"]

RUN apt-get update -yq && apt-get install -yq nodejs npm && mkdir -p "/pdf/html"

# Copy files
WORKDIR "/pdf"
COPY --chown=root:root [ "./docker/boot.sh", "./" ]
COPY --chown=root:root [ "./package.json", "./" ]
COPY --chown=root:root [ "./build",  "./build" ]
COPY --chown=root:root [ "./pdf",  "./pdf" ]

# Install packages
RUN npm --version && node --version && npm i --no-audit --production

# Entrypoint
ENTRYPOINT [ "./boot.sh" ]
