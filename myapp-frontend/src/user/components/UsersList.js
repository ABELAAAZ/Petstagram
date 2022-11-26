import React from 'react';
import UserItem from './UserItem';
import Card from '../../share/components/UIElements/Card';
import './UsersList.css';
import './UserItem.js'

const UsersList = props => {
    if (props.items.length === 0) {
        return (
            <div className='center'>
                <Card>
                    <h2>No user found.</h2>
                </Card>
                
        </div>);
    }
    console.log('2121');

    return (
        <ul className="users-list">
          {props.items.map(user => (
            <UserItem
              key={user.id}
              id={user.id}
              image={user.image}
              name={user.name}
              postCount={user.posts.length}
            />
          ))}
        </ul>
      );

};

export default UsersList;