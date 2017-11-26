/**
 * A mixin that changes a users name. If the user does not have a name yet,
 * two documents will be created, in the 'usernames' and 'users' collection.
 * If the user already has a name, the old doc in 'usernames' will be deleted.
 */
DiyMixinFirebaseUsername =
    (superClass) => class extends DiyMixinFirebase(superClass) {

  changeUsername(uid, newName, oldName) {
    return new Promise((resolve, reject) => {
      this.addUsernamesDoc_(resolve, reject, uid, newName, oldName);
    });
  }

  // The first step is to add a username doc to the 'usernames' collection.
  // If insertion fails, the username is already taken. It may have been taken
  // by the current user, so try to update the 'users' doc anyway.
  addUsernamesDoc_(resolve, reject, uid, newName, oldName) {
    if (!uid) {
      reject('User ID is invalid');
      return;
    }
    if (oldName == newName) {
      reject('New and old name are identical');
      return;
    }

    const db = this.getFirebaseFirestore();
    const nameDoc = db.collection('usernames').doc(newName);
    nameDoc.set({ uid })
        .then(() => {
          this.updateUsersDoc_(resolve, reject, uid, newName, oldName);
        })
        .catch((error) => {
          this.updateUsersDoc_(resolve, reject, uid, newName, oldName);
        });
  }

  // The second step is to update the doc in the 'users' collection. If the
  // update fails, the username is not registered yet, most likely because the
  // username is already taken.
  updateUsersDoc_(resolve, reject, uid, newName, oldName) {
    const db = this.getFirebaseFirestore();
    const userDoc = db.collection('users').doc(uid);
    userDoc.set({ name: newName })
        .then(() => {
          this.deleteUsernamesDoc_(resolve, reject, uid, oldName);
        }).catch(error => {
          reject('The name is already taken');
        });
  }

  // The last step is to delete the old usernames record in case the user
  // already had a name (and this is a name change). Ignore failures.
  deleteUsernamesDoc_(resolve, reject, uid, oldName) {
    if (!oldName) {
      resolve();
      return;
    }

    const db = this.getFirebaseFirestore();
    const nameDoc = db.collection('usernames').doc(oldName);
    nameDoc.delete()
        .then(() => {
          resolve();
        })
        .catch(error => {
          console.warn('Error deleting old username "' + oldName + '"');
          resolve();
        });
  }
};
