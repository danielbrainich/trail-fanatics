# Generated by Django 4.2.7 on 2024-03-11 01:20

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="customuser",
            name="bio",
            field=models.TextField(blank=True, max_length=560),
        ),
    ]