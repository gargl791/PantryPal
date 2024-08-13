from django.db import models


#From BTeamERD.puml

class User(models.Model):
    userId = models.CharField(max_length=10)
    username = models.CharField(max_length=30)
    password = models.CharField(max_length=30)
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    email = models.CharField(max_length=100)

    def __str__(self):
        return self.username


class Ingredient(models.Model):
    ingredientName = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.IntegerField()
    describe = models.TextField()
    picture = models.ImageField(null=True, blank=True)
    liquid = models.BooleanField()

    def __str__(self):
        return self.ingredientName + " by " + self.user.username


class Recipe(models.Model):
    recipeName = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipe = models.TextField()
    picture = models.ImageField(null=True, blank=True)

    def __str__(self):
        return self.recipeName + " by " + self.user.username


class Required(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    amount = models.IntegerField()

    def __str__(self):
        return self.ingredient.ingredientName + " in " + self.recipe.recipeName + " by " + self.user.username


class Shared(models.Model):
    recipeOwner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipeOwner')
    recipeName = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    userShared = models.ForeignKey(User, on_delete=models.CASCADE, related_name="userShared")

    def __str__(self):
        return self.recipeName + " made by " + self.recipeName + " shared  with " + self.userShared
