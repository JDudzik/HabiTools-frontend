FROM node:24.14.0-alpine

# Install serve globally
RUN yarn global add serve

# Copy the rest of the application code to the container
COPY . .

# Expose the port the app runs on
EXPOSE 3000

ENV NODE_ENV=production

# Start the application
CMD ["yarn", "start:prod"]