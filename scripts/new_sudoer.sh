#!/usr/bin/env bash

function new_sudoer() {
    local username=$1
    local home=/home/${username}
    local ssh=${home}/.ssh

    adduser --system --group ${username}
    mkdir ${ssh}
    chmod 0700 ${ssh}
    if [ $2 = "ssh" ]; then
        cp -Rfv /root/.ssh ${home}
    else
        touch ${ssh}/authorized_keys
    fi
    chown -Rfv ${username}.${username} ${ssh}
    chown -R ${username}:${username} ${home}
    gpasswd -a ${username} sudo
    service ssh restart
    usermod -s /bin/bash ${username}
}