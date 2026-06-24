FROM public.ecr.aws/nginx/nginx:stable-alpine
COPY frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
