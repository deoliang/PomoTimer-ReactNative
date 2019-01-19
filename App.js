//Author: Yuhao (Deon) Liang

import React from 'react';
import { StyleSheet, Text, View, Button, Vibration } from 'react-native';

//colour of buttons
const BUTTON_COLOUR = "#8ab3f7"

//default work time 25 min break time 5 min, edit to change
const WORK_MINUTES = 25
const WORK_SECONDS = 0
const BREAK_MINUTES = 5
const BREAK_SECONDS = 0


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    flexDirection: 'row',
    fontSize: 72,
  },
  buttonContainer: {
    paddingTop: "10%"
  },
  workBreakContainer: {
    fontSize: 44,
    paddingBottom: "10%"
  },
  dismissContainer: {
    flex: 1,
    marginLeft: "10%",
    marginRight: "10%",
    justifyContent: 'center',
  },
});

//Stateless functional component for displaying minutes
const Minutes = props => (
  <View>
    <Text style={styles.time}>{props.minutes}</Text>
  </View>
);

//Stateless functional component for displaying seconds
const Seconds = props => (
  <View>
    <Text style={styles.time}>{props.seconds}</Text>
  </View>
);


//component that defines main interface and state behaviour
export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      minutes: WORK_MINUTES,
      seconds: WORK_SECONDS,
      isPause: true, // to determine whether the time is paused
      workIsTrueBreakIsFalse: true, //work time is true, break time is false
    }
  }
  componentDidMount() {
    this.interval = setInterval(this.dec, 1000) //set interval to run the dec function once per second
  }

  componentWillUnmount() {
    clearInterval(this.interval) //clears the interval of running the dec function
  }

  //function that decrement the timer
  dec = () => {
    //when time is not paused, decrement seconds 
    if (this.state.isPause === false) {
      if (this.state.seconds !== 0) {
        this.setState(prevState => ({
          seconds: prevState.seconds - 1,
        }))
      //when seconds === 0 and minutes >0, decrement minute by 1, set seconds to 59
      } else if (this.state.seconds === 0 && this.state.minutes > 0) {
        this.setState(prevState => ({
          seconds: 59,
          minutes: prevState.minutes - 1,
        }))
      }
    }

  }
  //function  that starts and pauses the timer
  toggleStartPause = () => {
    this.setState(prevState => ({
      isPause: !prevState.isPause,
    }))
  }

  //function that resets the timer
  reset = () => {
    if (this.state.workIsTrueBreakIsFalse) {
      this.setState(prevState => ({
        isPause: true,
        minutes: WORK_MINUTES,
        seconds: WORK_SECONDS,
      }))
    } else {
      this.setState(prevState => ({
        isPause: true,
        minutes: BREAK_MINUTES,
        seconds: BREAK_SECONDS,
      }))
    }
  }

  //function that toggles the interface to work time
  toggleWork = () => {
    this.setState(prevState => ({
      isPause: true,
      minutes: WORK_MINUTES,
      seconds: WORK_SECONDS,
      workIsTrueBreakIsFalse: true,
    }))
  }

  //function that toggles the interface to break time
  toggleBreak = () => {
    this.setState(nextState => ({
      isPause: true,
      minutes: BREAK_MINUTES,
      seconds: BREAK_SECONDS,
      workIsTrueBreakIsFalse: false,
    }))
  }

  //function that dismisses the vibration once timer reaches 0:00
  dismissVibrate = () => {
    Vibration.cancel()
    this.interval = setInterval(this.dec, 1000)
    if (this.state.workIsTrueBreakIsFalse) {
      this.setState(prevState => ({
        isPause: true,
        minutes: WORK_MINUTES,
        seconds: WORK_SECONDS,
      }))
    } else {
      this.setState(prevState => ({
        isPause: true,
        minutes: BREAK_MINUTES,
        seconds: BREAK_SECONDS,
      }))
    }
  }

  render() {
    let mode = (this.state.workIsTrueBreakIsFalse) ? "Work" : "Break" //determine whether it is currently work or break time
    let disableToggle = (this.state.isPause) ? false : true // determine whether to disableToggle buttons once timer
    let timeCenter = (this.state.seconds>9) ? ":" : ":0" //determine whether to display : or :0 depending on seconds in timer

    //when timer reaches 0:00, vibrate
    if (this.state.seconds === 0 && this.state.minutes === 0) {
      clearInterval(this.interval)
      Vibration.vibrate([300, 500, 300], true) //continuous vibration until dismissed by button
      
      //return view containing button to dismiss the vibrations
      return (
        <View style={styles.dismissContainer}>
          <Button color={BUTTON_COLOUR} title="Dismiss" onPress={this.dismissVibrate} />
        </View>
      )
       } else {
        //returns main view that displays work/break mode, time and buttons
      return (
        <View style={styles.container}>
          <Text style={styles.workBreakContainer}>{mode}</Text>
          <View style={styles.time}>
            <Minutes minutes={this.state.minutes} />
            <Text style={styles.time}>{timeCenter}</Text>
            <Seconds seconds={this.state.seconds} />
          </View>
          <View style={styles.buttonContainer} >
            <View style={{ marginBottom: "5%" }}>
              <Button color={BUTTON_COLOUR} title="Start / Pause" onPress={this.toggleStartPause} />
            </View>
            <View style={{ marginBottom: "5%" }}>
              <Button color={BUTTON_COLOUR} title="Reset" onPress={this.reset} />
            </View>
            <View style={{ marginBottom: "5%" }}>
              <Button disabled={disableToggle} color={BUTTON_COLOUR} title="Toggle Work" onPress={this.toggleWork} />
            </View>
            <View>
              <Button disabled={disableToggle} color={BUTTON_COLOUR} title="Toggle Break" onPress={this.toggleBreak} />
            </View>
          </View>
        </View>

      )
    } 

  }
}


