from app.ai.vector_memory import VectorMemory

# Initialize the memory core
mem = VectorMemory()

# Force it to learn two messy UPI strings from your actual statement
mem.learn("UPI/DR/612991959434/Sanchali", "Sanchali Rent Account", "Transfers")
mem.learn("UPI/DR/PaytmQR28100505", "Local Supermarket", "Shopping")

print("Memory seeded successfully! Check the app/ai/ folder.")