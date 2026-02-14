FROM --platform=linux/amd64 cypress/base:20.9.0

ENV NPM_CONFIG_LOGLEVEL    warn
ENV NPM_CONFIG_UNSAFE_PERM true
ENV TERM                   xterm
ENV CHROME_VERSION         145.0.7632.75-1

# Remove any NodeSource apt repo that could overwrite the base image's Node 20
RUN rm -f /etc/apt/sources.list.d/nodesource* && apt-get update

# Install common dependencies
RUN apt-get install -y --fix-missing \
  tzdata \
  wget \
  curl \
  make \
  git

# Install libpng (Debian Bullseye has libpng16 available natively)
RUN apt-get install -y libpng16-16

RUN apt-get install -y --fix-missing xvfb xdg-utils libu2f-udev libvulkan1 libgtk-3-0 lsb-release libappindicator3-1 fonts-liberation libasound2 libnspr4 libnss3 libgbm1 \
  && curl https://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_${CHROME_VERSION}_amd64.deb -O \
  && dpkg -i google-chrome-stable_${CHROME_VERSION}_amd64.deb \
  && rm google-chrome-stable_${CHROME_VERSION}_amd64.deb \
  && google-chrome --version

WORKDIR /code

# Install dev packages
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . /code
