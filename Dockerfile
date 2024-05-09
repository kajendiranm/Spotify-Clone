# Use an existing Python Docker image as base

FROM python:3.12-alpine

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container

WORKDIR /app

# Copy the current directory contents into the container at /app

COPY . /app

# Install Django (or any other dependencies your project may need)
RUN pip install --no-cache-dir -r requirements.txt

#RUN pip install django
#RUN pip install Pillow

# Expose the port the app runs on

EXPOSE 8000

# Run the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
