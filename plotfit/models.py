from __future__ import unicode_literals

import os.path

from django.db import models
from django.conf import settings

# Create your models here.

class ReducedDataset(models.Model):
    filename = models.FilePathField(
        path=os.path.join(settings.BASE_DIR, "iq-data"),
    )

    def __unicode__(self):
        return self.filename
