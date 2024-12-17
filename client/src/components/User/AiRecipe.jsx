// import React, { useState } from 'react';
// import axios from 'axios';
// import { RxCross2 } from "react-icons/rx";

// const AiRecipe = () => {
//     const [ingredient, setIngredient] = useState('');
//     const [ingredientsList, setIngredientsList] = useState([]);
//     const [recipes, setRecipes] = useState([]);
//     const [selectedRecipe, setSelectedRecipe] = useState(null);
//     const [instructions, setInstructions] = useState('');
//     const [loading, setLoading] = useState(false);

//     const handleAddIngredient = () => {
//         if (ingredient.trim()) {
//             setIngredientsList([...ingredientsList, ingredient]);
//             setIngredient('');
//         }
//     };

//     const handleRemoveIngredient = (index) => {
//         setIngredientsList(ingredientsList.filter((_, i) => i !== index));
//     };

//     const handleGenerateRecipes = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.post('http://localhost:4000/api/ai-recipe', {
//                 stage: "recipe_suggestions",
//                 ingredients: ingredientsList
//             });
//             if (
//                 response.data &&
//                 response.data.response &&
//                 response.data.response.candidates &&
//                 response.data.response.candidates[0] &&
//                 response.data.response.candidates[0].content &&
//                 response.data.response.candidates[0].content.parts &&
//                 response.data.response.candidates[0].content.parts[0].text
//             ) {
//                 const recipeList = response.data.response.candidates[0].content.parts[0].text.split("\n");
//                 setRecipes(recipeList.filter(recipe => recipe.trim() !== ""));  // Filter out any empty strings
//             } else {
//                 console.error("Unexpected response structure:", response.data);
//                 setRecipes(["Error: Unable to fetch recipes."]);
//             }

//             setLoading(false);
//         } catch (error) {
//             console.error("Error generating recipes:", error);
//             setLoading(false);
//         }
//     };

//     const handleRecipeSelect = async (recipeTitle) => {
//         setSelectedRecipe(recipeTitle);
//         setLoading(true);
    
//         try {
//             const response = await axios.post('http://localhost:4000/api/ai-recipe', {
//                 stage: "recipe_instructions",
//                 selectedRecipeName: recipeTitle
//             });
    
//             if (
//                 response.data &&
//                 response.data.response &&
//                 response.data.response.candidates &&
//                 response.data.response.candidates[0] &&
//                 response.data.response.candidates[0].content &&
//                 response.data.response.candidates[0].content.parts &&
//                 response.data.response.candidates[0].content.parts[0].text
//             ) {
//                 // Extract and clean up JSON text
//                 const rawText = response.data.response.candidates[0].content.parts[0].text;
//                 const jsonText = rawText.replace(/```json\n|\n```/g, '');
    
//                 // Parse JSON data
//                 const recipeData = JSON.parse(jsonText);
    
//                 // Safely format recipe details
//                 const formattedRecipe = `
//                     Recipe Name: ${recipeData.title}
    
//                     Ingredients:
//                     ${(recipeData.ingredients || []).join('\n')}
    
//                     Optional Extras:
//                     ${(recipeData.optionalExtras || []).join('\n')}
    
//                    Instructions:
//                 ${
//                     (recipeData.instructions || [])
//                         .map((step, index) => {
//                             // Check if step has both step number and description
//                             if (step.step && step.description) {
//                                 return `Step ${step.step}: ${step.description}`;
//                             } else if (step.description) {
//                                 return `Step ${index + 1}: ${step.description}`;
//                             } else {
//                                 return `Step ${index + 1}: Description not provided`;
//                             }
//                         })
//                         .join('\n')
//                 }
//                 `;
    
//                 // Display formatted recipe
//                 setInstructions(formattedRecipe);
    
//             } else {
//                 console.error("Unexpected response structure:", response.data);
//                 setInstructions("Error: Unable to fetch recipe instructions.");
//             }
    
//             setLoading(false);
//         } catch (error) {
//             console.error("Error fetching recipe instructions:", error);
//             setLoading(false);
//         }
//     };
    
    

//     return (
//         <div className="flex flex-col items-center mx-4 md:mx-24 mt-10 space-y-6">
//         <div className='flex items-center justify-center gap-1'>
//           <h1 className='logo'>AI Recipe</h1>
//         </div>
//             <div className="flex-col flex bg-white shadow-md rounded-md w-full md:w-3/4 p-6">
//                 <div className="flex gap-3">
//                     <input
//                         className="inputBox1 w-full"
//                         type="text"
//                         name="ingredient"
//                         value={ingredient}
//                         placeholder="Add an ingredient"
//                         onChange={(e) => setIngredient(e.target.value)}
//                     />
//                     <button className="button1 font-bold text-xl" onClick={handleAddIngredient}>Add</button>
//                 </div>

//                 <div className="mt-4">
//                     <h3 className="text-lg font-semibold">Ingredients List</h3>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                         {ingredientsList.length === 0 ? (
//                             <p className="text-gray-500">No ingredients added yet.</p>
//                         ) : (
//                             ingredientsList.map((ing, index) => (
//                                 <span key={index} className="px-3 py-1 rounded-md bg-orange-200 text-gray-700 flex items-center">
//                                     {ing}
//                                     <RxCross2 
//                                         className="ml-2 text-red-500"
//                                         onClick={() => handleRemoveIngredient(index)}
//                                     />
//                                 </span>
//                             ))
//                         )}
//                     </div>
//                 </div>

//                 <div className="flex justify-center mt-6 w-full">
//                     <button className="button2 text-xl font-bold" onClick={handleGenerateRecipes} disabled={loading}>
//                         {loading ? "Generating..." : "Generate Recipes"}
//                     </button>
//                 </div>
//             </div>

//             {recipes.length > 0 && (
//                 <div className="bg-white shadow-md rounded-md w-full md:w-3/4 p-6">
//                     <h3 className="text-lg font-semibold">Pick your Recipe Suggested</h3>
//                     <div className="flex flex-col gap-2">
//                         {recipes.map((recipe, index) => (
//                             <div
//                                 key={index}
//                                 onClick={() => handleRecipeSelect(recipe)}
//                                 className="cursor-pointer text-base hover:text-[#fc802e] transition-colors duration-200 ease-in-out"
//                             >
//                                 {recipe}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {selectedRecipe && (
//                 <div className="bg-white shadow-md rounded-md w-full md:w-3/4 p-6">
//                     <h3 className="text-lg font-semibold">Instructions for {selectedRecipe}</h3>
//                     <p className="text-gray-700">{instructions}</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AiRecipe;

import React, { useState } from 'react';
import axios from 'axios';
import { RxCross2 } from "react-icons/rx";

const AiRecipe = () => {
    const [ingredient, setIngredient] = useState('');
    const [ingredientsList, setIngredientsList] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [instructions, setInstructions] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddIngredient = () => {
        if (ingredient.trim()) {
            setIngredientsList([...ingredientsList, ingredient]);
            setIngredient('');
        }
    };

    const handleRemoveIngredient = (index) => {
        setIngredientsList(ingredientsList.filter((_, i) => i !== index));
    };

    const handleGenerateRecipes = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:4000/api/ai-recipe', {
                stage: "recipe_suggestions",
                ingredients: ingredientsList
            });
            if (
                response.data &&
                response.data.response &&
                response.data.response.candidates &&
                response.data.response.candidates[0] &&
                response.data.response.candidates[0].content &&
                response.data.response.candidates[0].content.parts &&
                response.data.response.candidates[0].content.parts[0].text
            ) {
                const recipeList = response.data.response.candidates[0].content.parts[0].text.split("\n");
                setRecipes(recipeList.filter(recipe => recipe.trim() !== "")); // Filter out any empty strings
            } else {
                console.error("Unexpected response structure:", response.data);
                setRecipes(["Error: Unable to fetch recipes."]);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error generating recipes:", error);
            setLoading(false);
        }
    };

    const handleRecipeSelect = async (recipeTitle) => {
        setSelectedRecipe(recipeTitle);
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:4000/api/ai-recipe', {
                stage: "recipe_instructions",
                selectedRecipeName: recipeTitle
            });

            if (
                response.data &&
                response.data.response &&
                response.data.response.candidates &&
                response.data.response.candidates[0] &&
                response.data.response.candidates[0].content &&
                response.data.response.candidates[0].content.parts &&
                response.data.response.candidates[0].content.parts[0].text
            ) {
                // Extract and clean up JSON text
                const rawText = response.data.response.candidates[0].content.parts[0].text;
                const jsonText = rawText.replace(/```json\n|\n```/g, '');

                // Parse JSON data
                const recipeData = JSON.parse(jsonText);

                // Safely format recipe details
                const formattedRecipe = `
                    Recipe Name: ${recipeData.title}

                    Ingredients:
                    ${(recipeData.ingredients || []).join('\n')}

                    Optional Extras:
                    ${(recipeData.optionalExtras || []).join('\n')}

                    Instructions:
                    ${
                        (recipeData.instructions || [])
                            .map((step, index) => {
                                // Check if step has both step number and description
                                if (step.step && step.description) {
                                    return `Step ${step.step}: ${step.description}`;
                                } else if (step.description) {
                                    return `Step ${index + 1}: ${step.description}`;
                                } else {
                                    return `Step ${index + 1}: Description not provided`;
                                }
                            })
                            .join('\n')
                    }
                `;

                // Display formatted recipe
                setInstructions(formattedRecipe);

            } else {
                console.error("Unexpected response structure:", response.data);
                setInstructions("Error: Unable to fetch recipe instructions.");
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching recipe instructions:", error);
            setLoading(false);
        }
    };

    // Handle clearing all lists and selected recipe
    const handleClearChat = () => {
        setIngredientsList([]);
        setRecipes([]);
        setSelectedRecipe(null);
        setInstructions('');
    };

    return (
        <div className="flex flex-col items-center mx-4 md:mx-24 mt-10 space-y-6">
            <div className='flex items-center justify-center gap-1'>
                <h1 className='logo'>AI Recipe</h1>
            </div>
            
            <div className="flex-col flex bg-white shadow-md rounded-md w-full md:w-3/4 p-6">
                <div className="flex gap-3">
                    <input
                        className="inputBox1 w-full"
                        type="text"
                        name="ingredient"
                        value={ingredient}
                        placeholder="Add an ingredient"
                        onChange={(e) => setIngredient(e.target.value)}
                    />
                    <button className="button1 font-bold text-xl" onClick={handleAddIngredient}>Add</button>
                    <button className="button1 font-bold text-xl" onClick={handleClearChat}>Clear</button>
                </div>

                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Ingredients List</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {ingredientsList.length === 0 ? (
                            <p className="text-gray-500">No ingredients added yet.</p>
                        ) : (
                            ingredientsList.map((ing, index) => (
                                <span key={index} className="px-3 py-1 rounded-md bg-orange-200 text-gray-700 flex items-center">
                                    {ing}
                                    <RxCross2 
                                        className="ml-2 text-red-500"
                                        onClick={() => handleRemoveIngredient(index)}
                                    />
                                </span>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex justify-center mt-6 w-full">
                    <button className="button2 text-xl font-bold" onClick={handleGenerateRecipes} disabled={loading}>
                        {loading ? "Generating..." : "Generate Recipes"}
                    </button>
                </div>
            </div>

            {recipes.length > 0 && (
                <div className="bg-white shadow-md rounded-md w-full md:w-3/4 p-6">
                    <h3 className="text-lg font-semibold">Pick your Recipe Suggested</h3>
                    <div className="flex flex-col gap-2">
                        {recipes.map((recipe, index) => (
                            <div
                                key={index}
                                onClick={() => handleRecipeSelect(recipe)}
                                className="cursor-pointer text-base hover:text-[#fc802e] transition-colors duration-200 ease-in-out"
                            >
                                {recipe}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedRecipe && (
                <div className="bg-white shadow-md rounded-md w-full md:w-3/4 p-6">
                    <h3 className="text-lg font-semibold">Instructions for {selectedRecipe}</h3>
                    <p className="text-gray-700">{instructions}</p>
                </div>
            )}
        </div>
    );
};

export default AiRecipe;
