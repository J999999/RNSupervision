/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
/*
import React, {Fragment} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
*/
import URLS from './MVC/Tools/InterfaceApi';
import {RRCLoading, RRCAlert, RRCToast} from 'react-native-overlayer';
import {getGuid} from './MVC/Tools/JQGuid';
import React from 'react';
import NavigationService from './MVC/Tools/NavigationService'
import {createAppContainer, createStackNavigator} from 'react-navigation';

import Login from './MVC/Controller/Login'
import Home from './MVC/Controller/Home'
import {unitWidth} from "./MVC/Tools/ScreenAdaptation";
import Mine from './MVC/Controller/Mine'
import AddFunction from './MVC/Controller/AddFunction'
import AddIInterview from './MVC/Controller/EffectivenessAccountability/InspectorInterview/AddIInterview'//新增督查约谈
import IInterviewList from './MVC/Controller/EffectivenessAccountability/InspectorInterview/IInterviewList'//督查约谈
import CheckList from './MVC/View/CheckList'
import NoticeList from './MVC/Controller/NoticeList';
import NoticeAdd  from './MVC/Controller/NoticeAdd';
import NoticeDetail  from './MVC/Controller/NoticeDetail';
import AttachDetail  from './MVC/Controller/AttachDetail';

const AppNavigator = createStackNavigator({
  Login: {screen: Login},
  Home: {
    screen: Home,
    navigationOptions: ()=>({
      headerTitle: '云督考',
      headerLeft: null,
    })
  },
  Mine: {
    screen: Mine,
    navigationOptions: ()=>({
      headerTitle: '我的',
      headerLeft: null,
    })
  },
    AddFunction: {screen: AddFunction},
    IInterviewList: {screen: IInterviewList},
    CheckList: {screen: CheckList},
    AddIInterview: {screen: AddIInterview},
    NoticeList:  {screen: NoticeList},
    NoticeAdd:   {screen: NoticeAdd},
    NoticeDetail:   {screen: NoticeDetail},
    AttachDetail:   {screen: AttachDetail},

},{
  initialRouteName: 'Home',
  defaultNavigationOptions: {
    gesturesEnabled: false,
    headerStyle: {
      backgroundColor: '#38ADFF',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontSize: 20 * unitWidth,
      fontWeight: 'bold',
    },
    headerBackTitle: '返回',
  },
});

export default class App extends React.Component{
  render(): React.ReactNode {
    const Tab = createAppContainer(AppNavigator);
    return (
        <Tab
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef)
            }}/>
    )
  }
}
