import React from "react";
import Card from '../../share/components/UIElements/Card';
import PostItem from './PostItem'
import Button from '../../share/components/FormElements/Button';
import './PostList.css';
const PostList = props => {
  
  if (props.items.length === 0) {
    return (
      <div className="post-list center">
        <Card>
          <h2>No posts found. Maybe create one?</h2>
          <Button to="/posts/new">Share Post</Button>
        </Card>
      </div>
    );
  }

  if (props.order === 'ascending'){
    if (props.sort === 'date'){
      props.items.sort((a, b) => (a.dateCreated > b.dateCreated) ? 1 : -1);
    }
    else if (props.sort === 'title'){
      props.items.sort((a, b) => (a.title > b.title) ? 1 : -1);
    }
    else if (props.sort === 'comments'){
      props.items.sort((a, b) => (a.comments.length > b.comments.length) ? 1 : -1);
    }

  }
  else if ((props.order === 'descending')){
    if (props.sort === 'date'){
      props.items.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1);
    }
    else if (props.sort === 'title'){
      props.items.sort((a, b) => (a.title > b.title) ? -1 : 1);
    }
    else if (props.sort === 'comments'){
      props.items.sort((a, b) => (a.comments.length > b.comments.length) ? -1 : 1);
    }

  }

  return (
    
      <ul className="post-list">
        {props.items.map(post => (
            <PostItem
                key={post.id}
                id={post.id}
                image={post.image}
                title={post.title}
                description={post.description}
                address={post.address}
                creatorId={post.creator}
                coordinates={post.location}
                onDelete={props.onDeletePost}
            />
        ))}
      </ul>

  );


};

export default PostList;
