# Use the official Python image from the DockerHub
FROM python:3.10-slim

# Set the environment variables
RUN touch /env.txt
RUN printenv > /env.txt


# Set the working directory in docker
WORKDIR /app

# Copy the dependencies file to the working directory
COPY requirements.txt .

RUN pip install --upgrade pip           # to upgrade pip

RUN pip install "psycopg[binary,pool]"  # to install package and dependencies for psycopg

# Install any dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the content of the local src directory to the working directory
COPY . .

# Set the correct permissions
RUN chmod +x /app/setup.sh

# Specify the command to run on container start --noinput --username $USERNAME --email $EMAIL
CMD ["sh","/app/setup.sh"]
# ["python", "manage.py", "runserver", "0.0.0.0:8000"]