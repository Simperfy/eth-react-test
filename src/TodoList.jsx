import React from 'react';
import PropTypes from 'prop-types';

export default function TodoList({ tasks, createTask, toggleCompleted }) {
  let currentTask = {};

  return (
    <div id="content">
      <form onSubmit={(e) => {
        e.preventDefault();
        createTask(currentTask.value);
      }}
      >
        <input id="newTask" ref={(input) => { currentTask = input; }} type="text" className="form-control" placeholder="Add task..." required />
        <input type="submit" hidden />
      </form>
      <ul id="taskList" className="list-unstyled">
        { tasks.map((task) => (
          <div className="taskTemplate checkbox" key={task.id + task.content}>
            <div>
              <input
                type="checkbox"
                name={task.id}
                defaultChecked={task.completed}
                onClick={({ target }) => {
                  console.log('toggling', target.name);
                  toggleCompleted(target.name);
                }}
              />

              <span className="content">{task.content}</span>
            </div>
          </div>
        ))}
      </ul>
      <ul id="completedTaskList" className="list-unstyled" />
    </div>
  );
}

TodoList.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  })).isRequired,
  createTask: PropTypes.func.isRequired,
  toggleCompleted: PropTypes.func.isRequired,
};
