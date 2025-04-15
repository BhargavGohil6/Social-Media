import React, { useState } from 'react';
import { View, Text, TextInput, Image, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

const EditPostScreen = ({ route, navigation }) => {
  const post = route.params?.post;

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Post data not found.</Text>
      </View>
    );
  }

  const [image, setImage] = useState({ uri: post.imageUrl });
  const [caption, setCaption] = useState(post.caption || post.body);
  const dispatch = useDispatch();

  const handleSave = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} />
      <TextInput
        style={styles.input}
        value={caption}
        onChangeText={setCaption}
        placeholder="Edit caption"
      />
      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
  },
});

export default EditPostScreen;
