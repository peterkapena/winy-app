FROM arm64v8/node:alpine

# Create app directory
WORKDIR /app

# First, copy the package files
COPY package*.json ./

# Install app dependencies
RUN npm install

# Install 'forever' globally
# RUN npm install forever -g

# If you are building your code for production
RUN npm ci --only=production

# Bundle app source
COPY . .

# Set the environment variable for production
ENV NODE_ENV production

# Build the Next.js app for production
RUN npm run build
RUN apk add nano
RUN touch .env.production
# Expose the port your app will run on
EXPOSE 3000
EXPOSE 443

# Use 'forever' to run your Next.js app with the specified options
CMD ["npm", "start", "--", "-p", "3000"]

#                           docker build -t literatures .
#                           docker run -dp 3000:3000 literatures
#                           docker tag literatures kapenapeter/literatures:x.x.x //replace x.x.x by correct versiom
#                           docker push kapenapeter/literatures:x.x.x //replace x.x.x by correct versiom

#                           sudo docker pull kapenapeter/literatures:x.x.x //replace x.x.x by correct versiom
#                           sudo docker container rm literatures -f
#                           sudo docker rmi kapenapeter/literatures
#                           sudo docker pull kapenapeter/literatures:x.x.x //replace x.x.x by correct versiom
#                           sudo docker run -d --name literatures --network peterkapena kapenapeter/literatures:x.x.x //replace x.x.x by correct versiom
#                           sudo docker container rm -f literatures
#                           sudo docker container restart literatures
#create a user
#check if the server's ip address is in the allowed list in the atlas mongo db