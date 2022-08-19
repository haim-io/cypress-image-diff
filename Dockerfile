FROM node:14.17.0

ENV NPM_CONFIG_LOGLEVEL    warn
ENV NPM_CONFIG_UNSAFE_PERM true
ENV TERM                   xterm
ENV CHROME_VERSION         99.0.4844.82-1

RUN apt-get update

# Install common dependencies
RUN apt-get install -y \
  tzdata \
  wget \
  curl \
  make \
  git

# Fix error when libpng cannot be found after CircleCI restores cache for pngquant-bin.
# See https://github.com/tcoopman/image-webpack-loader/issues/95
RUN wget -q -O /tmp/libpng12.deb http://mirrors.kernel.org/ubuntu/pool/main/libp/libpng/libpng12-0_1.2.54-1ubuntu1_amd64.deb \
  && dpkg -i /tmp/libpng12.deb \
  && rm /tmp/libpng12.deb

# Install Cypress dependencies
RUN apt-get install -y \
  libgtk2.0-0 \
  libnotify-dev \
  libgconf-2-4 \
  libnss3 \
  libxss1 \
  libasound2 \
  xvfb

# Install Chrome (Version 86)
# See all available versions for download on: https://www.ubuntuupdates.org/package_logs?type=ppas&vals=8
RUN apt-get install -y xvfb xdg-utils libgtk-3-0 lsb-release libappindicator3-1 fonts-liberation libasound2 libnspr4 libnss3 \
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
