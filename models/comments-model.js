const mongoose = require( 'mongoose' );

const commentSchema = mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'authors',
        required : true
    }
});

const commentModel = mongoose.model( 'comments', commentSchema );

const Comments = {
    addComment : function( newComment ){
        return commentModel
                .create( newComment )
                .then( comment => {
                    return comment;
                })
                .catch( err => {
                    throw new Error( err.message );
                });
    },
    getAllComments : function(){
        return commentModel
                .find()
                .populate('author', ['firstName', 'lastName'] )
                .then( comments => {
                    return comments;
                })
                .catch( err => {
                    throw new Error( err.message );
                });
    },
    getCommentsByAuthorId : function( id ){
        return commentModel
                .find( { author : id } )
                .populate( 'author', ['firstName', 'lastName'] )
                .then( comments => {
                    return comments;
                })
                .catch( err => {
                    throw new Error( err.message );
                });
    }
}

module.exports = {
    Comments
};