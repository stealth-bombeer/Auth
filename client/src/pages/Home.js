import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
const { useAuthContext } = require("../hooks/useAuthContext");
const Home = () => {
    const { workouts,dispatch} = useWorkoutsContext();
    const { user } = useAuthContext();

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch("http://localhost:4000/api/workout",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${user.token}`,
        }
      });
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "SET_WORKOUTS", payload: json });
      }
    };
    if(user)
    {fetchWorkouts();}

  }, [dispatch,user]);

  return (
    <div className="home">
    <div className="workouts">
      {workouts && workouts.map(workout => (
        <WorkoutDetails workout={workout} key={workout._id} />
      ))}
    </div>
    <WorkoutForm/>
  </div>

  );
};

export default Home;
