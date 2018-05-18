#!/usr/bin/env bash

function check_and_install() {
    local package=$1
    if apt list --installed | grep --quiet ${package}; then
        :
    else
        apt-get install ${package}
    fi
}

function install_python2_and_pip() {
    check_and_install python2
#    check_and_install python-pip
}

function install_apache2_wsgi() {
    check_and_install apache2
    check_and_install libapache2-mod-wsgi

    a2enmod wsgi
    service apache2 restart
}

function install_TexDBook() {
    install_python2_and_pip
    install_apache2_wsgi

    check_and_install git
    check_and_install make

    local name="TexDBook"

    cd /var/www/
    mkdir ${name}
    cd ${name}
    git clone https://github.com/kkysen/TexDBook.git ${name}
    cd ${name}

    make install

    # TODO setup virtualenv

    local link=/etc/apache2/sites-available/${name}.conf
    rm -f ${link}
    ln -s ${name}.conf ${link}
    a2ensite ${name}
    service apache2 restart
}

