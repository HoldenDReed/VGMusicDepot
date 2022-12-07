import { Link } from "react-router-dom";
import { BsCheckCircle } from "react-icons/bs";
import { BsXLg } from "react-icons/bs";
import { useEffect, useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
const localUser = localStorage.getItem("capstone_user");
const userObject = JSON.parse(localUser);


export const Album = ({ id, title, img }) => {

    const [isFavorite, setIsFavorite] = useState(false)
    const [favoritesId, setFavoritesId] = useState("")
    useEffect(
        () => {
            const checkIfFavorite = async () => {
                const response = await fetch(`http://localhost:8088/favorites?uid=${userObject.uid}&albumId=${id}`)
                const responseJSON = await response.json()
                const responseLength = await responseJSON.length
                    setFavoritesId(responseJSON[0])
                if (await responseLength === 0) {
                    setIsFavorite(false)
                } else {
                    setIsFavorite(true)
                }
            }
            checkIfFavorite()
        },
        [id]
    )

    return <section className="album">
        <div>
            <Link to={`/albums/${id}`}><h3 className="albumTitle">{title}</h3></Link>
        </div>
        <div>
            <Link to={`/albums/${id}`}>
                <img src={img} className="albumCover"></img>
            </Link>
        </div>
        <div className="albumButton">
            {
                userObject.isStaff
                    ? <>
                        <button className="deleteButton" onClick={async () => {
                            if (window.confirm("Are you sure you want to delete?")) {
                                fetch(`http://localhost:8088/albums/${id}`, {
                                    method: "DELETE"
                                })
                                    .then(window.location.reload(false))
                            } else {

                            }
                        }}
                        > <BsXLg /> </button></>
                    : ""
            }
        </div>
        <div className="albumButton">
            {
                userObject.isStaff
                    ? ""
                    : <>
                        {
                            isFavorite
                                ? <button className="deleteButton"
                                    onClick={() => {
                                      if  (window.confirm("Are you sure?")) {
                                             fetch(`http://localhost:8088/favorites/${favoritesId.id}`, {
                                                method: "DELETE" 
                                            })
                                            .then(window.location.reload(false))
                                        } else {
                                            
                                        }
                                    }}
                                    
                                ><BsCheckCircleFill/></button>
                                : <button className="deleteButton" onClick={async () => {
                                    await fetch(`http://localhost:8088/favorites`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            uid: userObject.uid,
                                            albumId: id
                                        })
                                    })
                                    window.location.reload(false)
                                }}
                                > <BsCheckCircle /> </button>
                        }
                    </>
            }
        </div>
    </section>
}