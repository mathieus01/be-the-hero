import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FiPower, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import api from "../../services/api";
import LogoImg from "../../assets/logo.svg";
import "./styles.css";

export default function Profile() {
  const ongName = localStorage.getItem("ongName");
  const ongId = localStorage.getItem("ongId");
  const history = useHistory();
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    api
      .get("profiles", {
        headers: {
          Authorization: ongId
        }
      })
      .then(response => {
        setIncidents(response.data);
      });
  }, [ongId]);

  async function handleDelete(id) {
    try {
      await api.delete(`incidents/${id}`, {
        headers: {
          Authorization: ongId
        }
      });

      setIncidents(
        incidents.filter(incident => {
          return incident.id !== id;
        })
      );
    } catch (error) {
      console.log(error);
      alert(`Não foi possivel excluir o incidente`);
    }
  }

  function handleLogout() {
    localStorage.clear();
    history.push("/");
  }

  return (
    <div className="profile-container">
      <header>
        <img src={LogoImg} alt="Be the Hero" />
        <span>Bem vindo(a), {ongName}</span>

        <Link to="/incident/new" className="button">
          Cadastrar Novo Caso
        </Link>
        <button type="button" onClick={e => handleLogout()}>
          <FiPower size={18} color="#e02041"></FiPower>
        </button>
      </header>

      <h1>Casos cadastrados</h1>

      <ul>
        {incidents.map(incident => (
          <li key={incident.id}>
            <strong>Caso:</strong>
            <p>{incident.title}</p>

            <strong>Descricao:</strong>
            <p>{incident.description}</p>

            <strong>Valor:</strong>
            <p>
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL"
              }).format(incident.value)}
            </p>

            <button type="button" onClick={e => handleDelete(incident.id)}>
              <FiTrash2 size={20} color="#a8a8b3" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
