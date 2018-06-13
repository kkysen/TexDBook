# TexDBook

### By Khyber Sen, Adam Abbas, Naotaka Kinoshita, and Vivien Lee

[proto0](http://206.189.226.167/)

## How To Run

### For Deployment
Run `wget -qO- https://raw.githubusercontent.com/kkysen/TexDBook/master/scripts/install.sh | bash`.

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