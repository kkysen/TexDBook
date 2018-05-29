#!/usr/bin/env bash

function check_and_install() {
    local package=$1
    if apt list --installed 2> /dev/null | grep --quiet ${package}; then
        :
    else
        apt-get install ${package}
    fi
}

function install_python2_and_pip() {
    check_and_install python2
#    check_and_install python-pip
}

function install_apache2_wsgi_ssl() {
    check_and_install apache2
    check_and_install libapache2-mod-wsgi
#    check_and_install mod_ssl

    a2enmod wsgi
    a2enmod ssl
    service apache2 reload
}

function install_deployment() {
    install_python2_and_pip
    install_apache2_wsgi_ssl

    check_and_install git
    check_and_install make

    local name=$1
    local githubUserName=$2
    echo ${name}
    echo ${githubUserName}

    cd /var/www/
    if [ -d ${name} ]; then
        cd ${name}
        git pull
    else
#        local repo=https://github.com/${githubUserName}/${name}.git
        local repo=git@github.com:${githubUserName}/${name}.git
        echo ${repo}
        git clone ${repo} ${name}
        cd ${name}
    fi

    if [ -f Makefile ]; then
        make install
    fi

    # TODO setup virtualenv

    local link=/etc/apache2/sites-available/${name}.conf
    rm -f ${link}
    cp ${name}.conf ${link}
    a2ensite ${name}
    service apache2 reload
}

function install_TexDBook() {
    install_deployment TexDBook kkysen
}

function install_deploytest() {
    install_deployment deploytest stuy-softdev
}

install_TexDBook