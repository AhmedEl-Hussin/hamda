import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "./App.css";

// const DATA = [
//   {
//     id: "0e2f0db1-5457-46b0-949e-8032d2f9997a",
//     name: "Walmart",
//     items: [
//       { id: "26fd50b3-3841-496e-8b32-73636f6f4197", name: "3% Milk" },
//       { id: "b0ee9d50-d0a6-46f8-96e3-7f3f0f9a2525", name: "Butter" },
//     ],
//     tint: 1,
//   },
//   {
//     id: "487f68b4-1746-438c-920e-d67b7df46247",
//     name: "Indigo",
//     items: [
//       {
//         id: "95ee6a5d-f927-4579-8c15-2b4eb86210ae",
//         name: "Designing Data Intensive Applications",
//       },
//       { id: "5bee94eb-6bde-4411-b438-1c37fa6af364", name: "Atomic Habits" },
//     ],
//     tint: 2,
//   },
//   {
//     id: "25daffdc-aae0-4d73-bd31-43f73101e7c0",
//     name: "Lowes",
//     items: [
//       { id: "960cbbcf-89a0-4d79-aa8e-56abbc15eacc", name: "Workbench" },
//       { id: "d3edf796-6449-4931-a777-ff66965a025b", name: "Hammer" },
//     ],
//     tint: 3,
//   },
// ];

function App() {

  // const [stores, setStores] = useState(DATA);
  // const handleDragAndDrop = (results) => {
  //   const { source, destination, type } = results;

  //   if (!destination) return;

  //   if (
  //     source.droppableId === destination.droppableId &&
  //     source.index === destination.index
  //   )
  //     return;

  //   if (type === "group") {
  //     const reorderedStores = [...stores];

  //     const storeSourceIndex = source.index;
  //     const storeDestinatonIndex = destination.index;

  //     const [removedStore] = reorderedStores.splice(storeSourceIndex, 1);
  //     reorderedStores.splice(storeDestinatonIndex, 0, removedStore);

  //     return setStores(reorderedStores);
  //   }
  //   const itemSourceIndex = source.index;
  //   const itemDestinationIndex = destination.index;

  //   const storeSourceIndex = stores.findIndex(
  //     (store) => store.id === source.droppableId
  //   );
  //   const storeDestinationIndex = stores.findIndex(
  //     (store) => store.id === destination.droppableId
  //   );

  //   const newSourceItems = [...stores[storeSourceIndex].items];
  //   const newDestinationItems =
  //     source.droppableId !== destination.droppableId
  //       ? [...stores[storeDestinationIndex].items]
  //       : newSourceItems;

  //   const [deletedItem] = newSourceItems.splice(itemSourceIndex, 1);
  //   newDestinationItems.splice(itemDestinationIndex, 0, deletedItem);

  //   const newStores = [...stores];

  //   newStores[storeSourceIndex] = {
  //     ...stores[storeSourceIndex],
  //     items: newSourceItems,
  //   };
  //   newStores[storeDestinationIndex] = {
  //     ...stores[storeDestinationIndex],
  //     items: newDestinationItems,
  //   };

  //   setStores(newStores);
  // };

  const [todoTasks, setTodoTasks] = useState([])
  const [inProgressTasks, setInProgressTasks] = useState([])
  const [doneTasks, setDoneTasks] = useState([])

    // ***Handle drag and drop
    const handleDragEnd = (result) => {
      //  if the result destination object doesnot exisit we can return of that function
      if (!result.destination) {
        return;
      }
  
      const sourceTasks = getTasksByStatus(result.source.droppableId);
      const destinationTasks = getTasksByStatus(result.destination.droppableId);
  
      const [draggedTask] = sourceTasks.splice(result.source.index, 1);
      draggedTask.status = getStatusByDroppableId(result.destination.droppableId);
      destinationTasks.splice(result.destination.index, 0, draggedTask);
  
      if (result.source.droppableId === 'todo') {
        setTodoTasks(sourceTasks);
      } else if (result.source.droppableId === 'inProgress') {
        setInProgressTasks(sourceTasks);
      } else if (result.source.droppableId === 'done') {
        setDoneTasks(sourceTasks);
      }
  
      if (result.destination.droppableId === 'todo') {
        setTodoTasks(destinationTasks);
      } else if (result.destination.droppableId === 'inProgress') {
        setInProgressTasks(destinationTasks);
      } else if (result.destination.droppableId === 'done') {
        setDoneTasks(destinationTasks);
      }
  
      // Update the task status in the Manager
      updateTaskStatus(draggedTask.id, draggedTask.status);
  
    };
  
    const getStatusByDroppableId = (droppableId) => {
      if (droppableId === 'todo') {
        return 'ToDo';
      } else if (droppableId === 'inProgress') {
        return 'InProgress';
      } else if (droppableId === 'done') {
        return 'Done';
      }
    };
  
    const getTasksByStatus = (status) => {
      if (status === 'todo') {
        return todoTasks;
      } else if (status === 'inProgress') {
        return inProgressTasks;
      } else if (status === 'done') {
        return doneTasks;
      }
    };
  
    const updateTaskStatus = (taskId, newStatus) => {
      // Make an API request to update the task status in the backend
      axios.put(`${baseUrl}/Task/${taskId}/change-status`, { status: newStatus }, {
        headers: requestHeaders,
      })
        .then((response) => {
  
        })
        .catch((error) => {
  
        });
    };

  return (
    <>
    
    {/* <div className="layout__wrapper">
      <div className="card">
        <DragDropContext onDragEnd={handleDragAndDrop}>
          <div className="header">
            <h1>Shopping List</h1>
          </div>
          <Droppable droppableId="ROOT" type="group">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {stores.map((store, index) => (
                  <Draggable
                    draggableId={store.id}
                    index={index}
                    key={store.id}
                  >
                    {(provided) => (
                      <div
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <StoreList {...store} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div> */}

     <div>
      <h1 className="test">Ahmeddddddddddddd</h1>
              <DragDropContext onDragEnd={handleDragEnd} >
                <div
                  className={`d-flex justify-content-around  m-4 p-2 `}
                >
                  {/* ToDo column */}
                  <div className="" >
                    <Droppable droppableId="todo" direction="vertical"  >
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef}
                          {...provided.droppableProps}
                          // className={`${style.bgStatus} p-5`}
                          style={{
                            backgroundColor: (snapshot.isDraggingOver ? "#024337" : '#315951'),
                            padding: 5,
                            width: 310,
                            minHeight: 500
                          }}
                        >
                          <h4 className="text-white">To-Do</h4>
                          {todoTasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                              {(provided, snapshot) => (
                                <div

                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    userSelect: 'none',
                                    padding: 3,
                                    margin: '0 0 8px 0',
                                    minHeight: '20px',
                                    backgroundColor: snapshot.isDragging ? "#b26b07" : '#EF9B28',
                                    color: 'white',
                                    borderRadius: '10px',
                                    ...provided.draggableProps.style
                                  }}

                                >
                                  <div className={``}>
                                    <p className={``}>{task.title}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </Draggable>

                          ))}
                          {provided.placeholder}

                        </div>
                      )}
                    </Droppable>
                  </div>


                  {/* InProgress column */}
                  <div className="">
                    <Droppable droppableId="inProgress" direction="vertical">
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}
                          className=""
                          style={{
                            backgroundColor: (snapshot.isDraggingOver ? "#024337" : '#315951'),
                            padding: 5,
                            width: 310,
                            minHeight: 500
                          }}>
                          <h4 className="text-white">In Progress</h4>
                          {inProgressTasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    userSelect: 'none',
                                    padding: 3,
                                    margin: '0 0 8px 0',
                                    minHeight: '20px',
                                    backgroundColor: snapshot.isDragging ? "#b26b07" : '#EF9B28',
                                    color: 'white',
                                    borderRadius: '10px',
                                    ...provided.draggableProps.style
                                  }}

                                >
                                  <div className={` `}>
                                    <p className={``}>{task.title}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                  </div>

                  {/* Done column */}

                  <div className="">
                    <Droppable droppableId="done" direction="vertical">
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef}
                          {...provided.droppableProps}

                          style={{
                            backgroundColor: (snapshot.isDraggingOver ? "#024337" : '#315951'),
                            padding: 5,
                            width: 310,
                            minHeight: 500
                          }}
                        >
                          <h4 className="text-white">Done</h4>
                          {doneTasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`${style.taskItem}`}
                                  style={{
                                    userSelect: 'none',
                                    padding: 3,
                                    margin: '0 0 8px 0',
                                    minHeight: '20px',
                                    backgroundColor: snapshot.isDragging ? "#b26b07" : '#EF9B28',
                                    color: 'white',
                                    borderRadius: '10px',
                                    ...provided.draggableProps.style
                                  }}
                                >
                                  <div className={` `}>
                                    <p className={` text-decoration-line-through`}>{task.title}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>

                </div>
              </DragDropContext>
            </div>

    
    </>
  );
}

// function StoreList({ name, items, id }) {
//   return (
//     <Droppable droppableId={id}>
//       {(provided) => (
//         <div {...provided.droppableProps} ref={provided.innerRef}>
//           <div className="store-container">
//             <h3>{name}</h3>
//           </div>
//           <div className="items-container">
//             {items.map((item, index) => (
//               <Draggable draggableId={item.id} index={index} key={item.id}>
//                 {(provided) => (
//                   <div
//                     className="item-container"
//                     {...provided.dragHandleProps}
//                     {...provided.draggableProps}
//                     ref={provided.innerRef}
//                   >
//                     <h4>{item.name}</h4>
//                   </div>
//                 )}
//               </Draggable>
//             ))}
//             {provided.placeholder}
//           </div>
//         </div>
//       )}
//     </Droppable>
//   );
// }

export default App;