import { auth, db } from "@auth/firebase";
import {
    addDoc, collection,
    deleteDoc, doc, getCountFromServer, increment, runTransaction, setDoc, updateDoc
} from "firebase/firestore";
export async function addComment(comment: string, post_id: string, fn?: () => void) {
    const uid = auth.currentUser ? auth.currentUser.uid : "";
    try {
        await addDoc(collection(db, "posts", post_id, "comments"), {
            uid: uid,
            message: comment,
            timestamp: new Date(),
            likes: 0
        })
        await updateDoc(doc(db, "posts", post_id),
            {
                num_comments: increment(1)
            })
        if (fn) {
            fn();
        }
    } catch (e) {
        console.log("Couldn't comment: ", e);
    }
}



export async function deleteComment(postId: string, commentId: string) {
    const commentRef = doc(db, "posts", postId, "comments", commentId);
    const postRef = doc(db, "posts", postId);

    try {
        await runTransaction(db, async (transaction) => {
            const postData = await transaction.get(postRef);
            if (!postData) {
                console.log("Something went wrong, post not found");
                return;
            }
            transaction.update(postRef, { num_comments: postData.data()?.num_comments - 1 })
            transaction.delete(commentRef);
            console.log(postData?.data()?.num_comments, "is the comment count")
        })

    } catch (e) {
        console.log("Couldn't delete comment ", e);
    }
}


export async function likeComment(postId: string, commentId: string, userUid: string) {
    try {
        await setDoc(doc(db, "posts", postId, "comments", commentId, "likes", userUid),
            {
                createdAt: new Date()
            }
        )
    } catch (e) {
        console.log(e);
        return 0;
    }
}

export async function removeLikeFromComment(postId: string, commentId: string, userUid: string) {
    try {
        await deleteDoc(doc(db, "posts", postId, "comments", commentId, "likes", userUid));
    } catch (e) {
        console.log(e);
        return 0;
    }
}


export async function dislikeComment(postId: string, commentId: string, userUid: string) {
    try {
        await setDoc(doc(db, "posts", postId, "comments", commentId, "dislikes", userUid),
            {
                createdAt: new Date()
            }
        )
    } catch (e) {
        console.log(e);
        return 0;
    }
}

export async function removeDislikeFromComment(postId: string, commentId: string, userUid: string) {
    try {
        await deleteDoc(doc(db, "posts", postId, "comments", commentId, "dislikes", userUid));
    } catch (e) {
        console.log(e);
        return 0;
    }
}


export async function commentLikeCount(postId: string, commentId: string) {
    const likes = await getCountFromServer(collection(db, "posts", postId, "comments", commentId, "likes"));
    return likes.data().count;
}

export async function commentDislikeCount(postId: string, commentId: string) {
    const dislikes = await getCountFromServer(collection(db, "posts", postId, "comments", commentId, "dislikes"));
    return dislikes.data().count;
}