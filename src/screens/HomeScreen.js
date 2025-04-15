import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPostsAsync, likePost, dislikePost,deletePostAsync } from '../components/redux/postsSlice';


const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const status = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      
      console.log('Initiated posts fetch');
      try {
        await dispatch(fetchPostsAsync()).unwrap();
        console.log('Posts fetched successfully');
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };
  
    if (isMounted) {
      fetchData();
    }
  
    return () => {
      isMounted = false;
    };
  }, [dispatch]);
  const resetDatabase = async () => {
    await db.transaction(tx => {
      tx.executeSql('DELETE FROM posts');
    });
    dispatch(fetchPostsAsync());
  };

  const handleLike = (postId) => {
    dispatch(likePost(postId));
  };

  const handleDislike = (postId) => {
    dispatch(dislikePost(postId));
  };

  if (status === 'loading') {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (status === 'failed') {
    return <Text>Error: {error}</Text>;
  }

  const handleDelete = async (postId) => {
    try {
      await dispatch(deletePostAsync(postId)).unwrap();
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        extraData={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.post}>
            {/* User Profile and Username */}
            <View style={styles.userInfo}>
              <Image
                source={{ uri: item.profilePicture || 'https://via.placeholder.com/50' }} 
                style={styles.profilePicture}
              />
              <Text style={styles.username}>{ `User ${item.userId}`}</Text> Use item.username or a fallback
            </View>

            {/* Post Image */}
            <Image
              source={{ uri: item.imageUrl || 'https://via.placeholder.com/300' }} 
              style={styles.postImage}
            />

  
            {/* Like, Comment, and Share Icons */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.actionButton}>
                <Icon name="heart" size={24} color={item.liked ? 'red' : 'black'} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="comment" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="share-alt" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {/* Likes Count */}
            <Text style={styles.likesCount}>
              {item.reactions?.likes || 0} likes
            </Text>

            {/* Caption */}
            <Text style={styles.caption}>
              <Text style={styles.captionUsername}>{item.username || `User ${item.userId}`}</Text> {item.caption || item.body}
            </Text>
            <View style={styles.postActions}>
              <TouchableOpacity 
                onPress={() => navigation.navigate('EditPost', { postId: item.id })}
                style={styles.actionButton}
              >
                <Text>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => handleDelete(item.id)}
                style={[styles.actionButton, { marginLeft: 10 }]}
              >
                <Text style={{ color: 'red' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
          
        )}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('UploadPost')}
      >
        <Icon name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  post: {
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postImage: {
    width: '100%',
    height: 300,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  actionButton: {
    marginRight: 15,
  },
  likesCount: {
    fontWeight: 'bold',
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  caption: {
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  captionUsername: {
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#3897f0',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10
  }
  
});

export default HomeScreen;