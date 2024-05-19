from pymongo import MongoClient, errors
from bson import ObjectId, json_util

uri = "mongodb+srv://ashambickus:r2ST4fJx95KjC2E@cluster0.7wepwzs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(uri)

def get_all_documents():
    try:
        database = client.get_database("diplom")
        book = database.get_collection("book")

        cur = book.find()
        
        entries = []
        for entry in cur:
            entries.append(json_util.dumps(entry))


        return entries
    except errors.PyMongoError as e:
        raise Exception(f"MongoDB update error: {e}")
    except Exception as e:
        raise Exception(f"An unexpected error occurred: {e}")

def get_document(id):
    try:
        database = client.get_database("diplom")
        book = database.get_collection("book")

        cur = book.find_one({"_id": ObjectId(id)})
        # entries = []
        # for entry in cur:
        entry = cur


        return entry

    except errors.PyMongoError as e:
        raise Exception(f"MongoDB update error: {e}")
    except Exception as e:
        raise Exception(f"An unexpected error occurred: {e}")

def create_document(filename):
    try:
            database = client.get_database("diplom")
            book = database.get_collection("book")

            entry = {
                "name": filename,
                "status": "In queue"
            }

            return_id = book.insert_one(entry).inserted_id


            return return_id
    except errors.PyMongoError as e:
        raise Exception(" error: ", e)

def delete_document(id):
    try:
        database = client.get_database("diplom")
        book = database.get_collection("book")

        book.delete_one({"_id" : ObjectId(id)})

        
    except errors.PyMongoError as e:
        raise Exception(f"MongoDB update error: {e}")
    except Exception as e:
        raise Exception(f"An unexpected error occurred: {e}")
    
def update_status(id, status):
    try:
        database = client.get_database("diplom")
        book = database.get_collection("book")

        update_result = book.find_one_and_update(
          {"_id": ObjectId(id)}, {"$set": {"status": status}}
        )

        if update_result is None:
            raise Exception(f"Document with ID '{id}' not found.")


        return True  # Or a success message

    except errors.PyMongoError as e:
        raise Exception(f"MongoDB update error: {e}")
    except Exception as e:
        raise Exception(f"An unexpected error occurred: {e}")

# test = create_document("aaaa")

# print(test)
# test = get_all_documents()

# for a in test:
#     print(a["_id"])