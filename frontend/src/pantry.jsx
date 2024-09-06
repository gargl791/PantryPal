import React, { useState,useEffect  } from 'react';
import Modal from 'react-modal';
import './css/pantrypage.css';  // Assuming your CSS is adapted for React
import milk from "./images/milk.jpg";
import flour from "./images/flour.jpg";
import logo from "./images/pantrypal-logo.png";
import axios from "axios";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

Modal.setAppElement('#root');  // Assuming your root div has an ID of 'root'


function PantryGrid({ logoutProp, deleteAccountProp }) {
    const [menuVisible, setMenuVisible] = useState(false);
    const [ingredients, setIngredients] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [ingredientName, setIngredientName] = useState("");
    const [picture, setPicture] = useState("");
    const [describe, setDescribe] = useState("");
    const [amount, setAmount] = useState("");
    const [liquid, setLiquid] = useState(false);

// Get Ingredients
    useEffect(() => {
        get_ingredients()
    },[]);

 // Function to fetch ingredients
    const get_ingredients = () => {
        fetch("/api/getIngredients/", {
           headers: {
             "Content-Type": "application/json",
           },
           credentials: "same-origin",
        })
        .then((res) => res.json()) //// Parse the response as JSON
        .then((data) => {
            let objects = JSON.parse(data);
            let temp = [];
            for (let i = 0; i < objects.length; i++) {
                console.log(objects[i])
                temp.push(
                    <div className="item">
                        <img src= {'Storage/'+objects[i].fields.picture} alt="Milk" />
                        <span>{objects[i].fields.ingredientName}</span>
                        <span>{objects[i].fields.amount}{(objects[i].fields.liquid)?'ml' : 'g'}</span>
                        <div className="item-buttons">
                            <button onClick={() => window.location.href = 'editIngredient.html'}>Edit</button>
                            <button onClick={() => deleteIngredient(objects[i].pk)}>Delete</button>
                        </div>
                    </div>
                );
            }
            setIngredients(temp);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);  // Toggle visibility state
    };

    const closeMenu = () => {
        setMenuVisible(false);  // Set menu to not visible
    };

    const logout = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        logoutProp();
    };

    const deleteAccount = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        deleteAccountProp();
    };

    const deleteIngredient = async (ingredientId) => {
      try {
        const response = await axios.delete(`/api/deleteIngredient/${ingredientId}`)
        get_ingredients()
        console.log(`Deleted ingredient with id: ${ingredientId} successfully`)
      } catch (error) {
        console.log("Error in deleting ingredient: ", error);
      }
    }

 // Function to toggle the modal
    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

// Function to create ingredients
const createIngredients = async (event) => {
    event.preventDefault();
    try {
        const response = await axios.post("/api/createIngredient/", {
            ingredientName,
            picture,
            describe,
            amount,
            liquid
        });
        setIngredientName("");
        setPicture("");
        setDescribe("");
        setAmount("");
        setLiquid(false);
        closeModal();
        get_ingredients();  // Refresh ingredients after adding
    } catch (error) {
        console.error("Error creating ingredient:", error);
    }
};
const checkHandler = () => {
    setLiquid(!liquid)
}





    return (
        <>
            <header>
                <nav className="navbar">
                    <div className="menu-button" onClick={toggleMenu}>☰</div>
                    <div className="logo-container">
                        <a href="/"><img src={logo} alt="PantryPal Logo" className="logo" /></a>
                    </div>
                </nav>
            </header>
            <main>
                <h2>What's in your pantry?</h2>
                <div className="pantry-grid">
                    {/* You can map through an array of items instead of hardcoding them */}
                    {/* Example of one item */}
                    {ingredients}
                    <div className="item">
                        <img src={milk} alt="Milk" />
                        <span>Milk</span>
                        <span>500ml</span>
                        <div className="item-buttons">
                            <button onClick={() => window.location.href = 'editIngredient.html'}>Edit</button>
                            <button onClick={() => window.location.href = 'deleteIngredient.html'}>Delete</button>
                        </div>
                    </div>
                    <div className="item">
                        <img src={milk} alt="Milk" />
                        <span>Milk</span>
                        <span>500ml</span>
                        <div className="item-buttons">
                            <button onClick={() => window.location.href = 'editIngredient.html'}>Edit</button>
                            <button onClick={() => window.location.href = 'deleteIngredient.html'}>Delete</button>
                        </div>
                    </div>
                    <div className="item">
                        <img src={milk} alt="Milk" />
                        <span>Milk</span>
                        <span>500ml</span>
                        <div className="item-buttons">
                            <button onClick={() => window.location.href = 'editIngredient.html'}>Edit</button>
                            <button onClick={() => window.location.href = 'deleteIngredient.html'}>Delete</button>
                        </div>
                    </div>
                    <div className="item">
                        <img src={flour} alt="Flour" />
                        <span>Flour</span>
                        <span>1kg</span>
                        <div className="item-buttons">
                            <button onClick={() => window.location.href = 'editIngredient.html'}>Edit</button>
                            <button onClick={() => window.location.href = 'deleteIngredient.html'}>Delete</button>
                        </div>
                    </div>
                    {/* Repeat for other items */}
                    <div className="item" onClick={openModal} /*onClick={() => window.location.href = 'addIngredient'}*/ style={{ cursor: 'pointer' }}>
                        <h4>Add Ingredient</h4>
                    </div>
                </div>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Add Ingredient Modal"
                    className="modal"
                    overlayClassName="overlay"
                >
                    <h2>Add Ingredient</h2>
                    <form onSubmit={createIngredients}>
                        <label for="ingredientName">Name:</label>
                        <input type="text" id="ingredientName" name="ingredientName" required value={ingredientName} onChange={e => setIngredientName(e.target.value)}/>
                        <label for="picture">Picture:</label>
                        <input type="file" id="picture" name="picture" accept="image/*" value={picture} onChange={e => setPicture(e.target.value)}/>

                        <label for="describe">Describe:</label>
                        <input type="text" id="describe" name="describe" value={describe} onChange={e => setDescribe(e.target.value)}/>

                        <label for="amount">Amount (g/mL):</label>
                        <input type="number" id="amount" name="amount" required min="0" value={amount} onChange={e => setAmount(e.target.value)}/>

                        <label for="liquid">Liquid:</label>
                        <input type="checkbox" id="liquid" name="liquid" value={liquid} onChange={checkHandler}/>

                        <button type="submit">Add Ingredient</button>
                        <button onClick={closeModal}>Close</button>
                    </form>
                </Modal>
                <div className="button-container">
                    { <button onClick={() => window.location.href = 'newrecipe.html'} >Let's Get Baking!</button>}
                </div>
            </main>
            <div id="side-menu" className="side-nav" style={{ width: menuVisible ? '250px' : '0' }}>
                <a href="javascript:void(0)" className="closebtn" onClick={closeMenu}>&times;</a>
                <a href="/pantrypage" className="active">Pantry</a>
                <a href="/newrecipe">New Recipes</a>
                <a href="/myrecipes">My Recipes</a>
                <div className="nav-bottom">
                <a href="#" onClick={logout}>Log Out</a>
                    <a href="#" onClick={deleteAccount}>Delete Account</a>
                </div>
            </div>
        </>
    );
}

export default PantryGrid;
