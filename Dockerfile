ARG NODE_VERSION=22.11.0 as build

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as builder
 
# Set working directory for all build stages.
WORKDIR /usr/src/app
 
################################################################################
# Create a stage for installing production dependencies.
FROM base as deps
 
# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.pnpm to speed up subsequent builds.
# Leverage bind mounts to package.json and pnpm.lock to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.pnpm-store \
    corepack enable && pnpm install --frozen-lockfile \

################################################################################
# Create a stage for building the application.
FROM deps as build
 
# Copy the rest of the source files into the image.
COPY . .
 
# Run the build script.
RUN pnpm run build
 
################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base as final
 
# Use production node environment by default.
ENV NODE_ENV production
 
# Pay attention to set the correct origin and port for the application.
# This is used by the application to determine the origin of requests.
# If you don't set this, the application will default to http://localhost:3000
# If you set a wrong origin, the application may not work correctly, for example routeAction$ will not work
ENV ORIGIN http://gradinapp-view-1x6e8p-cbefa8-161-97-86-243.traefik.me/
 
# Run the application as a non-root user.
USER node
 
# Copy package.json so that package manager commands can be used.
COPY package.json .
 
# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/server ./server
 
# Expose the port that the application listens on.
EXPOSE 3042
 
# Run the application.
CMD pnpm serve