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

    const filteredUser = props.items.filter((el) => {
        //if no input the return the original
        if (props.input === '') {
            return el;
        }
        //return the item which contains the user input
        else {
            return el.name.toLowerCase().includes(props.input)
        }
    })

    return (
        <ul className="users-list">
          {filteredUser.map(user => (
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