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

class VideoEditingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUri: null
    };
  }
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
        // const source = { uri: response.uri };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          fileUri: response.path
        });
      }
    });
  };
  trimVideo() {
    console.log("trimVideo is called!");
    const options = {
      startTime: 5,
      endTime: 20,
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
    console.log("compressVideo is called!");
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

  getVideoInfo() {
    this.videoPlayerRef
      .getVideoInfo()
      .then(info => console.log(info))
      .catch(console.warn);
  }
  onLoad = value => {
    console.log("onLoad is", value);
  };
  render() {
    return (
      <View>
        <Button title={"Video picker"} onPress={this.pickDocument.bind(this)} />

        {this.state.fileUri ? (
          <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
            <VideoPlayer
              ref={ref => (this.videoPlayerRef = ref)}
              play={true} // default false
              replay={true} // should player play video again if its ended
              rotate={true} // use this prop to rotate video if it captured in landscape mode iOS only
              source={this.state.fileUri}
              playerWidth={300} // iOS only
              playerHeight={500} // iOS only
              height={300}
              onLoad={e => console.log("e", e)}
              resizeMode={VideoPlayer.Constants.resizeMode.COVER}
              onChange={({ nativeEvent }) => console.log({ nativeEvent })} // get Current time on every second
            />
            <Trimmer
              source={this.state.fileUri}
              height={150}
              width={300}
              onTrackerMove={e => console.log(e.currentTime)} // iOS only
              //currentTime={this.video.currentTime} // use this prop to set tracker position iOS only
              themeColor={"white"} // iOS only
              thumbWidth={30} // iOS only
              trackerColor={"green"} // iOS only
              onChange={e => console.log(e.startTime, e.endTime)}
              onTrackerMove={() => this.trimVideo()}
            />
          </View>
        ) : null}
        <Button title={"Video Trim"} onPress={() => this.trimVideo()} />
      </View>
    );
  }
}

export default VideoEditingScreen;
