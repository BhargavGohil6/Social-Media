import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { addPost } from '../components/redux/postsSlice';
import Icon from 'react-native-vector-icons/FontAwesome';

const UploadPostScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth?.user) || { 
    username: 'User', 
    id: 1 
  };

  const handleChooseImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1000,
        maxHeight: 1000,
      },
      (response) => {
        if (!response.didCancel && !response.error && response.assets?.[0]?.uri) {
          setImage({ uri: response.assets[0].uri });
        }
      }
    );
  };

  const handleSubmit = async () => {
    if (!image) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    const newPost = {
      id: Date.now(),
      userId: currentUser.id,
      username: currentUser.username,
      profilePicture: currentUser.profilePicture || 'https://i.imgur.com/abc123.jpg',
      imageUrl: image.uri,
      caption,
      title: caption.substring(0, 30) || 'New Post',
      body: caption || '',
      likes: 0,
      comments: [],
      reactions: { likes: 0 },
      timestamp: new Date().toISOString(),
      isSynced: false
    };

    try {
      await dispatch(addPost(newPost)).unwrap();
      navigation.goBack();
    } catch (error) {
      console.error('Save post error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to save post. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.imagePicker} 
        onPress={handleChooseImage}
        disabled={isSubmitting}
      >
        {image ? (
          <Image source={image} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="camera" size={40} color="#aaa" />
            <Text style={styles.placeholderText}>Select Image</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.captionInput}
        placeholder="Write a caption..."
        placeholderTextColor="#999"
        value={caption}
        onChangeText={setCaption}
        multiline
        numberOfLines={4}
        editable={!isSubmitting}
      />

      <Button 
        title={isSubmitting ? "Posting..." : "Share Post"} 
        onPress={handleSubmit}
        disabled={isSubmitting || !image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  imagePicker: {
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginTop: 8,
    color: '#aaa',
  },
  captionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
  },
});

export default UploadPostScreen;