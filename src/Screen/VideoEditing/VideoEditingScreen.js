import React from "react";
import PropTypes from "prop-types";
import { View, Text, Button } from "react-native";
import styles from "./VideoEditingScreenStyleSheet";
//Third party
import { VideoPlayer, Trimmer } from "react-native-video-processing";
import {
  DocumentPicker,
  DocumentPickerUtil
} from "react-native-document-picker";
import ImagePicker from "react-native-image-picker";
import MediaMeta from "react-native-media-meta";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

class VideoEditingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUri: null,
      videoDuration: 0,
      multiSliderValue: [0],
      startTime: 0,
      endTime: 1000
    };
  }

  // millisToMinutesAndSeconds(millis) {
  //   let minutes = Math.floor(millis / 60000);
  //   let seconds = ((millis % 60000) / 1000).toFixed(0);
  //   return parseInt(minutes + . + (seconds < 10 ? "0" : "") + seconds);
  // }
  pickDocument = () => {
    const options = {
      mediaType: "video"
    };
    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        console.log("response is", response);
        //Get duration
        MediaMeta.get(response.path)
          .then(metadata => {
            console.log(metadata);
            const duration = parseInt(metadata.duration);
            const totalSec = duration / 1000;
            console.log("totalSec is", totalSec);
            this.setState({
              videoDuration: totalSec,
              multiSliderValue: [...this.state.multiSliderValue, totalSec]
            });
          })
          .catch(err => console.error(err));

        this.setState({
          fileUri: response.path
        });
      }
    });
  };
  //Video trim
  trimVideo() {
    const options = {
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      saveToCameraRoll: true, // default is false // iOS only
      saveWithCurrentDate: true // default is false // iOS only
    };
    this.videoPlayerRef
      .trim(options)
      .then(newSource => {
        alert(`Successfully trim ${newSource}`);
        console.log(newSource);
      })
      .catch(console.warn);
  }
  compressVideo() {
    const options = {
      width: 720,
      height: 1280,
      bitrateMultiplier: 3,
      saveToCameraRoll: true, // default is false, iOS only
      saveWithCurrentDate: true, // default is false, iOS only
      minimumBitrate: 300000,
      removeAudio: true // default is false
    };
    this.videoPlayerRef
      .compress(options)
      .then(newSource => console.log(newSource))
      .catch(console.warn);
  }

  getPreviewImageForSecond(second) {
    const maximumSize = { width: 640, height: 1024 }; // default is { width: 1080, height: 1080 } iOS only
    this.videoPlayerRef
      .getPreviewForSecond(second, maximumSize) // maximumSize is iOS only
      .then(base64String =>
        console.log("This is BASE64 of image", base64String)
      )
      .catch(console.warn);
  }

  multiSliderValuesChange = values => {
    console.log("values is", values);
    this.setState({
      multiSliderValue: values,
      startTime: values[0],
      endTime: values[1]
    });
  };
  render() {
    return (
      <View style={styles.container}>
        {this.state.fileUri ? (
          <View>
            <VideoPlayer
              ref={ref => (this.videoPlayerRef = ref)}
              play={true} // default false
              replay={true} // should player play video again if its ended
              rotate={true} // use this prop to rotate video if it captured in landscape mode iOS only
              source={this.state.fileUri}
              playerWidth={300} // iOS only
              playerHeight={500} // iOS only
              height={300}
              resizeMode={VideoPlayer.Constants.resizeMode.COVER}
              onChange={({ nativeEvent }) => console.log({ nativeEvent })} // get Current time on every second
            />
            <View style={styles.textView}>
              <Text>{`Stat From: ${this.state.multiSliderValue[0]} `}</Text>
              <Text>{`To End: ${this.state.multiSliderValue[1]}  `}</Text>
            </View>
            <MultiSlider
              values={[
                this.state.multiSliderValue[0],
                this.state.multiSliderValue[1]
              ]}
              sliderLength={280}
              onValuesChange={this.multiSliderValuesChange}
              min={0}
              max={this.state.multiSliderValue[1]}
              step={1}
            />
            <Button title={"Trim Video"} onPress={() => this.trimVideo()} />
          </View>
        ) : (
          <Button
            title={"Choose File"}
            onPress={() => this.pickDocument(this)}
          />
        )}
      </View>
    );
  }
}

export default VideoEditingScreen;
