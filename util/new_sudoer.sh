#!/usr/bin/env bash

function new_sudoer() {
    local username=$1
    local home=/home/${username}
    local ssh=${home}/.ssh

    adduser --system --group ${username}
    mkdir ${ssh}
    chmod 0700 ${ssh}
#    cp -Rfv /root/.ssh ${home}
    chown -Rfv ${username}.${username} ${ssh}
    chown -R ${username}:${username} ${home}
    gpasswd -a ${username} sudo
    service ssh restart
    usermod -s /bin/bash ${username}
}