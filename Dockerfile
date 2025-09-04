FROM perl:5-bookworm

RUN mkdir -p /usr/src/app && groupadd --gid 1000 postgres && useradd -ms /bin/bash -u 1000 -g 1000 postgres && chown -R postgres:postgres /usr/src/app
WORKDIR /usr/src/app

ENV DEBIAN_FRONTEND=noninteractive 

RUN apt-get update && apt-get install --no-install-recommends -y curl postgresql-common r-base r-recommended pandoc poppler-utils tini libvips-dev imagemagick && \
  /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh -y && apt-get install --no-install-recommends -y postgresql postgresql-17-pgvector

# Install cpanm
RUN curl -L https://cpanmin.us | perl - --sudo App::cpanminus

# Install Perl dependencies
RUN cpanm --notest Mojolicious::Lite Mojo::Pg Data::Dumper Mojo::File Mojo::JSON Encode Mojo::Template Text::CSV Statistics::R Archive::Zip File::Basename Data::UUID Cwd Fcntl Text::ParseWords Mojo::Promise Mojo::IOLoop File::Temp

# Install R packages
RUN R -e "install.packages(c('rjson', 'BiocManager'), dependencies=TRUE, repos='http://cran.rstudio.com/')" && \
    R -e "BiocManager::install('EBImage')"

RUN ln -s /usr/bin/R /usr/local/bin/R && \
    echo "local all  all  trust" > /etc/postgresql/17/main/pg_hba.conf && \
    echo "host  all  all  127.0.0.1/32 trust" >> /etc/postgresql/17/main/pg_hba.conf && \
    echo "host  all  all  ::1/128    trust" >> /etc/postgresql/17/main/pg_hba.conf && \
    echo "listen_addresses='*'" >> /etc/postgresql/17/main/postgresql.conf && \
    chown -R postgres:postgres /var/run/postgresql

USER postgres

COPY --chown=postgres:postgres sql_template.sql .
COPY --chown=postgres:postgres start.sh .
COPY --chown=postgres:postgres . .

EXPOSE 3036

# cleanly shutdown postgres by using process group killing
ENTRYPOINT ["/usr/bin/tini", "-g", "--", "/usr/src/app/start.sh"]
