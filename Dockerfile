FROM nginx:1.25-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/inkwell.conf

# Copy static assets
COPY static/ /usr/share/nginx/html/static/

# Copy HTML pages
COPY html/index.html /usr/share/nginx/html/index.html
COPY html/signup.html /usr/share/nginx/html/signup.html
COPY html/login.html /usr/share/nginx/html/login.html
COPY html/post.html /usr/share/nginx/html/post.html
COPY html/profile.html /usr/share/nginx/html/profile.html
COPY html/users.html /usr/share/nginx/html/users.html
COPY html/user.html /usr/share/nginx/html/user.html

EXPOSE 80
