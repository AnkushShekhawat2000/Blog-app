const blogDataValidation = ({title, textBody})=> {
    return new Promise((resolve, reject) => {
        if(!title || !textBody) return reject("Missing Blog Data");
        if(typeof title !== "string") return reject("Title is not a text");
        if(typeof textBody !== "string") return reject("TextBody is not a text");

        if(title.length < 3 || title.length > 100) return reject("title length must be between 3 - 100");
        if(textBody.length < 3 || textBody.length > 1000) return reject("TextBody length must be between 3 - 1000");


        resolve();

    })
}

module.exports = blogDataValidation;