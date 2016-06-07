
from django.views.generic import TemplateView
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse

from . import plots

class IndexView(TemplateView):
    template_name = "index.html"

class Plot1DView(TemplateView):
    template_name = "plot.html"

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(Plot1DView, self).get_context_data(**kwargs)
        context['plot'] = plots.plot1d()
        return context

class Plot2DView(TemplateView):
    template_name = "plot.html"

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(Plot2DView, self).get_context_data(**kwargs)
        context['plot'] = plots.plot2d()
        return context

class Plot3DView(TemplateView):
    template_name = "plot.html"

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(Plot3DView, self).get_context_data(**kwargs)
        context['plot'] = plots.plot3d()
        return context

class Plot1DMultipleView(TemplateView):
    template_name = "plot_multiple.html"

    def get_context_data(self, **kwargs):
        n = int(kwargs['n'])
        # Call the base implementation first to get a context
        context = super(Plot1DMultipleView, self).get_context_data(**kwargs)
        context['plot'] = plots.plot1d_multiple(n)
        return context

def plot1d_multiple_ajax(request,n):
    """
    Only handles AJAX queries
    """
    print n
    return HttpResponse(plots.plot1d_multiple(int(n)))

class PlotIqView(TemplateView):
    template_name = "plot_fit.html"

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(PlotIqView, self).get_context_data(**kwargs)
        context['filename'] = 'data/{}'.format(self.kwargs['filename'])
        return context

class PlotLiveView(TemplateView):
    template_name = "plot_live.html"

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(PlotLiveView, self).get_context_data(**kwargs)
        context['plot'] = plots.plotLive()
        return context

def  plot_live_update(request):
    '''
    Handle ajax call to update the live plot
    '''
    if request.is_ajax():
        data = plots.live_plot_get_data_serialized()
        # In order to allow non-dict objects to be serialized set the safe parameter to False
        return JsonResponse([data], safe=False)
    else:
        return HttpResponseBadRequest()

class PlotIqSelectFile(TemplateView):
    template_name = "plotIq_select_file.html"

    def get_context_data(self, **kwargs):
        context = super(PlotIqSelectFile, self).get_context_data(**kwargs)
        context['filenames'] = ['HSA_test.dat', 'scan1_Iq.txt', 'scan2_Iq.txt'] + \
                               [ '67670_frame1_Iq.txt', '67671_frame1_Iq.txt',
            '67672_frame1_Iq.txt', '67673_frame1_Iq.txt', '67692_frame1_Iq.txt',
            '67693_frame1_Iq.txt', '67694_frame1_Iq.txt', '67695_frame1_Iq.txt',
            '67696_frame1_Iq.txt', '67697_frame1_Iq.txt', '67698_frame1_Iq.txt',
            '67699_frame1_Iq.txt', '67700_frame1_Iq.txt', '67701_frame1_Iq.txt',
            '67702_frame1_Iq.txt', '67703_frame1_Iq.txt', '67704_frame1_Iq.txt',
            '67705_frame1_Iq.txt', '67706_frame1_Iq.txt', '67707_frame1_Iq.txt',
            '67708_frame1_Iq.txt', '67709_frame1_Iq.txt', '67711_frame1_Iq.txt',
            '67712_frame1_Iq.txt', '67713_frame1_Iq.txt', '67714_frame1_Iq.txt',
            '67715_frame1_Iq.txt', '67716_frame1_Iq.txt', '67717_frame1_Iq.txt',
            '67718_frame1_Iq.txt', '67719_frame1_Iq.txt', '67720_frame1_Iq.txt',
            '67721_frame1_Iq.txt', '67722_frame1_Iq.txt', '67723_frame1_Iq.txt',
            '67724_frame1_Iq.txt', '67725_frame1_Iq.txt', '67726_frame1_Iq.txt',
            '67727_frame1_Iq.txt', '67728_frame1_Iq.txt', '67730_frame1_Iq.txt',
            '67731_frame1_Iq.txt', '67732_frame1_Iq.txt', '67733_frame1_Iq.txt',
            '67734_frame1_Iq.txt', '67735_frame1_Iq.txt', '67736_frame1_Iq.txt',
            '67737_frame1_Iq.txt', '67738_frame1_Iq.txt', '67739_frame1_Iq.txt',
            '67740_frame1_Iq.txt', '67741_frame1_Iq.txt', '67742_frame1_Iq.txt',
            '67743_frame1_Iq.txt', '67744_frame1_Iq.txt', '67745_frame1_Iq.txt',
            '67746_frame1_Iq.txt', '67747_frame1_Iq.txt', '68048_frame1_Iq.txt',
            '68049_frame1_Iq.txt', '68050_frame1_Iq.txt', '68051_frame1_Iq.txt',
            '68052_frame1_Iq.txt', '68053_frame1_Iq.txt', '68054_frame1_Iq.txt',
            '68055_frame1_Iq.txt', '68056_frame1_Iq.txt', '68057_frame1_Iq.txt',
            '68059_frame1_Iq.txt', '68060_frame1_Iq.txt', '68061_frame1_Iq.txt',
            '68062_frame1_Iq.txt', '68063_frame1_Iq.txt', '68064_frame1_Iq.txt',
            '68065_frame1_Iq.txt', '68066_frame1_Iq.txt', '68067_frame1_Iq.txt',
            '68069_frame1_Iq.txt', '68071_frame1_Iq.txt', '68072_frame1_Iq.txt',
            '68073_frame1_Iq.txt', '68074_frame1_Iq.txt', '68075_frame1_Iq.txt',
            '68076_frame1_Iq.txt', '68077_frame1_Iq.txt', '68079_frame1_Iq.txt',
            '68080_frame1_Iq.txt', '68081_frame1_Iq.txt', '68083_frame1_Iq.txt',
            '68084_frame1_Iq.txt', '68085_frame1_Iq.txt', '68087_frame1_Iq.txt',
            '68088_frame1_Iq.txt', '68089_frame1_Iq.txt', ]
        return context

class PlotAutoFitSelectFile(TemplateView):
    template_name = "plot_auto_fit_select_file.html"

    def get_context_data(self, **kwargs):
        context = super(PlotAutoFitSelectFile, self).get_context_data(**kwargs)
        context['filenames'] = ['HSA_test.dat', 'scan1_Iq.txt', 'scan2_Iq.txt']
        return context

class PlotAutoFitView(TemplateView):
    template_name = "plot_auto_fit.html"

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(PlotAutoFitView, self).get_context_data(**kwargs)
        context['filename'] = 'data/{}'.format(self.kwargs['filename'])
        return context
