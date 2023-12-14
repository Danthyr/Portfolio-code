
# Get the form data from Reactjs and add the data to the database 
@app.route('/api/editForm', methods=['POST'])
def formdata():
    formdata = request.json['questions']
    survey_id_del = formdata[0]['ids']
    
    dbm.delete_form(survey_id_del)
    print("dit is de data uit het form",formdata)
    # multi-vraag =  []
    for i in formdata:
        # If the type is open then add the question to the database 
        if i['type'] == "open" :

            # Get the text from the question
            vraag = i['text']
            # Get the id from the survey
            id = i['ids']
            dbm.add_form_open(vraag,id)

        # If the type is multiple-choice then add the question and the multiple choice questions connected to the question to the database    
        elif i['type'] == "multiple-choice":
            

             # Get the text from the question
            vraag = i['text']
            # Get the id from the survey
            id = i['ids']
            choice_id_raw=dbm.add_form_multiple(vraag,id)
            choice_id = (choice_id_raw[0][0])
           
            choices = i['choices']
            letter = chr(64)
            for choice in choices:
                letter = chr(ord(letter)+1)
                print(letter)
                dbm.add_form_multiple_choices(choice,letter,choice_id)

        else:
            print("error")
   
    return jsonify({'result': 'success'})

# get survey_id from react and get all questions from that id and send it to react 
@app.route('/api/data/<id>')
def get_data(id):
    # retrieve data for given id and get the questions based on that id
    surveyId = id
    # get the questions from the database
    test = dbm.get_questions(surveyId)
    getQuestions = []
    print(test , "dit is de test")
    for i in test:
        # if the type is open then add the question to the list
        if i[2] == 0:
            print(i,"open data")
            # add the opem question to the list
            getQuestions.append({'type': 'open', 'text': i[1], 'ids': i[3]})


        # if the type is multiple-choice then add the question to the list
        if i[2] == 1:
            print(i,"Multiple choice data")
            # get the choices from the database
            choices = dbm.get_choices(i[0])
            # convert the choices to a list
            choices = [i[0] for i in choices]
            print(choices, "alle keuzes")
            # add the multiple choice question to the list
            getQuestions.append({'type': 'multiple-choice', 'text': i[1], 'choices':choices , 'ids': i[4]})


        else:
            print("error")    
    # convert to JSON and return

    return jsonify(getQuestions)