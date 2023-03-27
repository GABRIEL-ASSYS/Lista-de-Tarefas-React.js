import './App.css';
import { useState, useEffect } from 'react';
import { db, auth } from './firebaseConnection'
import {
  doc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore'
import { async } from '@firebase/util'

function App() {
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [tarefas, setTarefas] = useState([])
  const [idTarefa, setIdTarefa] = useState('')

  useEffect(() => {
    async function carregarTarefas() {
      const dados = onSnapshot(collection(db, "tarefas"), (snapshot) => {
        let listaTarefa = []

        snapshot.forEach((doc) => {
          listaTarefa.push({
            id: doc.id,
            titulo: doc.data().titulo,
            descricao: doc.data().descricao
          })
        })

        setTarefas(listaTarefa)

      })
    }

    carregarTarefas()
  }, [])

  async function adicionarTarefa() {
    await addDoc(collection(db, "tarefas"), {
      titulo: titulo,
      descricao: descricao
    })
      .then(() => {
        console.log("Sucesso!")
        setDescricao('')
        setTitulo('')
      })
      .catch((error) => {
        console.log("Erro: " + error)
      })
  }

  async function buscaTarefa() {
    const tarefaRef = collection(db, "tarefas")

    await getDocs(tarefaRef)
      .then((snapshot) => {
        let lista = []

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            descricao: doc.data().descricao
          })
        })
        setTarefas(lista)
      })
      .catch((error) => {
        console.log("Erro na busca: " + error)
      })
  }

  async function editarTarefa() {
    const tarefaRef = doc(db, "tarefas", idTarefa)

    await updateDoc(tarefaRef, {
      titulo: titulo,
      descricao: descricao
    })
    .then(() => {
      console.log("Atualizado!")
      setIdTarefa('')
      setDescricao('')
      setTitulo('')
    })
    .catch((error) => {
      console.log("Erro na edição: " + error)
    })
  }

  async function excluirTarefa(id) {
    const tarefaRef = doc(db, "tarefas", id)

    await deleteDoc(tarefaRef) 
    .then(() => {
      alert("Tarefa deletada!")
    })
    .catch((error) => {
      console.log("Erro na exclusão: " + error)
    })
  }

  return (
    <div>
      <h1>Lista de Tarefas</h1>
      <div className='container'>
        <h2>Tarefas:</h2>
        <label>ID da Tarefa:</label>
        <input placeholder='Digite o ID da tarefa' value={idTarefa} onChange={(id) => setIdTarefa(id.target.value)}/>
        <br />

        <label>Título:</label>
        <textarea type='text' value={titulo} onChange={(titulo) => setTitulo(titulo.target.value)}/>
        <br />

        <label>Descrição:</label>
        <textarea type='text' value={descricao} onChange={(descricao) => setDescricao(descricao.target.value)}/>
        <br />

        <button onClick={adicionarTarefa}>Adicionar</button>
        <button onClick={buscaTarefa}>Buscar</button>
        <button onClick={editarTarefa}>Editar</button>

        <ul>
          {tarefas.map((tarefa) => {
            return (
              <li>
                <span>ID: {tarefa.id}</span>
                <br />
                <span>Título: {tarefa.titulo}</span>
                <br />
                <span>Descrição: {tarefa.descricao}</span>
                <br />
                <button onClick={() => excluirTarefa(tarefa.id)}>Excluir</button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default App;