# TexDBook

### By Team Mr. Brown I Don't Feel So Good:
### Khyber Sen, Adam Abbas, Naotaka Kinoshita, and Vivien Lee

[Click here to go to TexDBook](http://206.189.226.167/)

Watch a [demo](https://www.youtube.com/watch?v=2NNeKi9yK8Y) of TexDBook (also on the website itself).

## How To Run

### For Deployment
Run `wget -qO- https://raw.githubusercontent.com/kkysen/TexDBook/master/scripts/install.sh | bash`.

This script:
  - installs the necessary dependencies,
  - clones or pulls this repo into `/var/www/TexDBook`,
  - runs `make install`, which installs more dependencies and sets up some data files,
  - generates the conf file `TexDBook.conf` and copies it to `/etc/apache2/sites-available/`,
  - enables the site with `a2ensite`,
  - and reloads Apache with `service apache2 reload`.

### For Development

  1. Clone this repository: ```git clone https://github.com/kkysen/TexDBook.git```.
  2. Create a virtual environment using ```virtualenv``` or activate an existing one.
  3. In the virtual environment, cd into the repository
     and run ```make install``` to install dependencies
     and then ```make run``` to start the Flask server.
     If you don't have ```make```, run ```sudo apt-get install make```.
  4. With the Flask app now running, navigate to [```localhost:5000```](http://localhost:5000) in your browser.

## How to Compile

To compile and bundle (using Webpack) the TypeScript and any other JavaScript,
you need [```node```](https://nodejs.org/en/download/current/) and ```npm```.<br>
Once ```npm``` is installed, run ```make compile-install``` to install ```npm``` dependencies.<br>
Then run ```make js```,
which makes Webpack watch all the files and recompile them if anything changes.