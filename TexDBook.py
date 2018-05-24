from TexDBook import create_app

app, name = create_app()

if __name__ == '__main__':
    app.run(debug=True)
