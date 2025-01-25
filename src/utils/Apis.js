import { supabase } from "./supabase";

export async function createPost(userId, content, imageUrl, videoUrl) {
    const { data, error } = await supabase
        .from("posts")
        .insert({
            user_id: userId,
            content,
            image_url: imageUrl,
            video_url: videoUrl,
        })
        .select();

    if (error) throw error;
    return data[0];
}

export async function getPosts() {
    const { data, error } = await supabase
        .from("posts")
        .select(`
      *,
      users (id, username, name, profile_image),
      comments (
        id,
        content,
        created_at,
        users (id, username, name, profile_image)
      ),
      likes (id, user_id)
    `)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}

export async function likePost(userId, postId) {
    const { data, error } = await supabase.from("likes").insert({ user_id: userId, post_id: postId });

    if (error) throw error;
    return data;
}

export async function unlikePost(userId, postId) {
    const { error } = await supabase.from("likes").delete().match({ user_id: userId, post_id: postId });

    if (error) throw error;
}

export async function createComment(userId, postId, content) {
    const { data, error } = await supabase
        .from("comments")
        .insert({
            user_id: userId,
            post_id: postId,
            content,
        })
        .select(`
      *,
      users (id, username, name, profile_image)
    `);

    if (error) throw error;
    return data[0];
}

export async function deletePost(postId) {
    const { error } = await supabase.from("posts").delete().match({ id: postId });

    if (error) throw error;
}