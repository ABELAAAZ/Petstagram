import React, { useContext, useState } from 'react';
import Card from '../../share/components/UIElements/Card';
import {  Link, useHistory } from 'react-router-dom';
import Modal from '../../share/components/UIElements/Modal';
import { useHttpClient } from '../../share/hooks/http-hook';
import Button from '../../share/components/FormElements/Button';
import Map from '../../share/components/UIElements/Map';
import { AuthContext } from '../../share/context/auth-context';
import './PostDetailContentComment.css';


const PostDetailContent = props => {
    const auth = useContext(AuthContext);
    const {sendRequest } = useHttpClient();
    const [showMap, setShowMap] = useState(false);
    const openMapHandler = () => setShowMap(true);
    const closeMapHandler = () => setShowMap(false);
    const history = useHistory();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const showDeleteWarningHandler = () => {
        setShowConfirmModal(true);
    };
    const cancelDeleteHandler = () => {
        setShowConfirmModal(false);
    };
    const confirmDeleteHandler = async () => {
        setShowConfirmModal(false);
        try {
            await sendRequest(`http://localhost:4000/api/posts/${props.item.id}`, 'DELETE',
                null, { Authorization: 'Bearer ' + auth.token });
            history.push(`/${auth.userId}/posts`);
        } catch (err) { }

    };

    return (

        <React.Fragment>
            <Modal show={showMap} onCancel={closeMapHandler}
                header={props.item.address}
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>} >

                <div className='map-container'>
                    <Map center={props.item.location} zoom={16} />
                </div>
            </Modal>

            <Modal
                show={showConfirmModal}
                onCancel={cancelDeleteHandler}
                header="ARE you sure"
                footerClass="place-item__modal-actions"
                footer={
                    <React.Fragment>
                        <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
                        <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
                    </React.Fragment>
                }>
                <p>Do you want to delete?</p>
            </Modal>

            
                <Card className="post-item__content">
                    <div className='post-item__image'>
                        <img src={`http://localhost:4000/${props.item.image}`} alt={props.item.title} />
                    </div>
                    <div className='post-item__info'>
                        <h2>{props.item.title}</h2>

                        <p>{props.item.description}</p>
                        <h5>{props.item.address}</h5>
                    </div>
                    <div className='post-item__actions'>
                        <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
                        {auth.isLoggedIn && props.item.creator === auth.userId && (<Link to={`/posts/${props.item.id}/update`}><Button>EDIT</Button></Link>)}
                        {auth.isLoggedIn && props.item.creator === auth.userId && (<Button danger onClick={showDeleteWarningHandler}>DELETE</Button>)}
                    </div>
                </Card>
           
        </React.Fragment>
    );


}
export default PostDetailContent;