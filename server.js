const express = require( 'express' );
const mongoose = require( 'mongoose' );
const morgan = require( 'morgan' );
const bodyParser = require( 'body-parser' );
const { DATABASE_URL, PORT } = require( './config' );
const { Authors } = require( './models/authors-model' );
const { Comments } = require( './models/comments-model' );
const authorRouter  = require('./routes/author-route');

const app = express();
const jsonParser = bodyParser.json();

app.use( '/blog-post', authorRouter );
app.post( '/blog-post/add-comment', jsonParser, ( req, res ) => {
    const { title, content, id } = req.body;

    // Validations go here

    Authors
        .getAuthorById( id )
        .then( author => {

            if( !author ){
                // Validation needed here
            }

            const newComment = {
                title, 
                content,
                author : author._id
            }
            
            Comments
                .addComment( newComment )
                .then( comment => {
                    
                    let newComments = author.comments;
                    newComments.push( comment._id );

                    Authors.updateComments( author._id, newComments )
                        .then( count => {
                            return res.status( 201 ).json( comment );
                        });
                    
                })
                .catch( err => {
                    res.statusMessage = err.message;
                    return res.status( 400 ).end();
                });
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});

app.get( '/blog-post/comments', ( req, res ) => {
    Comments
        .getAllComments()
        .then( comments => {

            const filteredComments = comments.map( comment => {
                return {
                    title : comment.title,
                    content : comment.content,
                    author : `${comment.author.firstName} ${comment.author.lastName}`
                }
            });
            /*
            const filteredComments = [];

            for( let i = 0; i < comments.length; i ++ ){
                filteredComments.push({
                    title : comments[i].title,
                    content : comments[i].content,
                    author : `${comments[i].author.firstName} ${comments[i].author.lastName}`
                })
            } */

            return res.status( 200 ).json( filteredComments );
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});

app.get( '/blog-post/comments-by-author/:id', ( req, res ) => {
    const id = req.params.id;

    // Validations required here

    Authors
        .getAuthorById( id )
        .then( author => {

            if( !author ){
                // Send back an error
            }

            Comments
                .getCommentsByAuthorId( author._id )
                .then( comments => {
                    return res.status( 200 ).json( comments );
                })
                .catch( err => {
                    res.statusMessage = err.message;
                    return res.status( 400 ).end();
                });
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});

app.listen( PORT, () =>{
    console.log( "This server is running on port 8080" );

    new Promise( ( resolve, reject ) => {

        const settings = {
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true
        };
        mongoose.connect( DATABASE_URL, settings, ( err ) => {
            if( err ){
                return reject( err );
            }
            else{
                console.log( "Database connected successfully." );
                return resolve();
            }
        })
    })
    .catch( err => {
        console.log( err );
    });
});