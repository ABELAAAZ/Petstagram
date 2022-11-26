import React from 'react';
import Card from '../../share/components/UIElements/Card';

import './PostDetailContentComment.css';



const PostDetailComment =props => {
    
    if (props.item.length === 0) {
        return (
            <div className='center'>
                <Card>
                    <h2>No comment yet</h2>
                </Card>
        </div>);
    }


    return (
        <div className='center'>
                <Card>
                    <h2>This is comment</h2>
                </Card>
        </div>
    );


}
export default PostDetailComment;