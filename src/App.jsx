import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import './App.scss';
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from './abi';
import TodoList from './TodoList';

const web3 = new Web3(window.ethereum || 'http://localhost:8545');
if (window.ethereum) window.ethereum.enable();
export default function App() {
  const [account, setAccount] = useState('');
  const [taskCount, setTaskCount] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [todoList, setTodoList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const resetState = () => {
    setAccount('');
    setTaskCount(0);
    setTasks([]);
    setTodoList(null);
    setIsLoading(true);
  };
  const loadBlockchainData = async () => {
    resetState();
    const accounts = await web3.eth.getAccounts();
    // console.log(accounts);
    setAccount(accounts[0]);

    const newTodoList = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS);
    setTodoList(newTodoList);

    const newTaskCount = await newTodoList.methods.taskCount().call();
    setTaskCount(newTaskCount);

    for (let i = 1; i <= newTaskCount; i += 1) {
    // eslint-disable-next-line no-await-in-loop
      const task = await newTodoList.methods.tasks(i).call();
      setTasks((oldTasks) => [...oldTasks, task]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const createTask = (content) => {
    setIsLoading(true);
    todoList.methods.createTask(content).send({ from: account })
      .once('receipt', (receipt) => {
        loadBlockchainData();
        // console.log(receipt);
      });
  };

  const toggleCompleted = (taskId) => {
    setIsLoading(true);
    todoList.methods.toggleCompleted(taskId).send({ from: account })
      .once('receipt', (receipt) => {
        loadBlockchainData();
      // console.log(receipt);
      });
  };

  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="/" target="_blank" rel="noreferrer">Todo List</a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small>
              <a className="nav-link" href="/">
                {account}
                <span id="account" />
              </a>
            </small>
          </li>
        </ul>
      </nav>
      <div className="container-fluid">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex justify-content-center">
            { isLoading
              ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
              : (
                <TodoList
                  tasks={tasks}
                  createTask={createTask}
                  toggleCompleted={toggleCompleted}
                />
              )}
          </main>
        </div>
      </div>
    </div>
  );
}
